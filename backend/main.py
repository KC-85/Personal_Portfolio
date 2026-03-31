from __future__ import annotations

import json
import logging
import os
import re
import smtplib
from datetime import datetime, timezone
from email.message import EmailMessage
from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from dotenv import load_dotenv


EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DEFAULT_STORAGE_PATH = DATA_DIR / "contact_submissions.jsonl"

load_dotenv(BASE_DIR / ".env")
logger = logging.getLogger(__name__)


class ContactSubmission(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=5, max_length=255)
    subject: str = Field(min_length=3, max_length=200)
    message: str = Field(min_length=10, max_length=5000)

    @field_validator("name", "email", "subject", "message")
    @classmethod
    def strip_whitespace(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("This field is required")
        return cleaned

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        if not EMAIL_PATTERN.match(value):
            raise ValueError("Please enter a valid email address")
        return value


class ContactResponse(BaseModel):
    message: str
    submission_id: str
    received_at: str


def env_flag(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def get_allowed_origins() -> list[str]:
    configured = os.getenv("CONTACT_ALLOWED_ORIGINS")
    if configured:
        return [origin.strip() for origin in configured.split(",") if origin.strip()]

    return [
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://127.0.0.1:4173",
        "http://localhost:4173",
    ]


def get_storage_path() -> Path:
    configured = os.getenv("CONTACT_STORAGE_PATH")
    if configured:
        return Path(configured).expanduser().resolve()
    return DEFAULT_STORAGE_PATH


def email_delivery_enabled() -> bool:
    required = [
        os.getenv("CONTACT_RECIPIENT_EMAIL"),
        os.getenv("CONTACT_SMTP_HOST"),
        os.getenv("CONTACT_FROM_EMAIL"),
    ]
    return all(value and value.strip() for value in required)


def send_submission_email(submission: ContactSubmission, submission_id: str, received_at: str) -> None:
    recipient_email = os.getenv("CONTACT_RECIPIENT_EMAIL", "").strip()
    smtp_host = os.getenv("CONTACT_SMTP_HOST", "").strip()
    from_email = os.getenv("CONTACT_FROM_EMAIL", "").strip()
    smtp_port = int(os.getenv("CONTACT_SMTP_PORT", "587"))
    smtp_username = os.getenv("CONTACT_SMTP_USERNAME", "").strip()
    smtp_password = os.getenv("CONTACT_SMTP_PASSWORD", "")
    from_name = os.getenv("CONTACT_FROM_NAME", "Portfolio Contact Form").strip()
    use_starttls = env_flag("CONTACT_SMTP_USE_STARTTLS", True)

    if not recipient_email or not smtp_host or not from_email:
        return

    email_message = EmailMessage()
    email_message["Subject"] = f"New portfolio contact: {submission.subject}"
    email_message["From"] = f"{from_name} <{from_email}>"
    email_message["To"] = recipient_email
    email_message["Reply-To"] = submission.email
    email_message.set_content(
        "\n".join(
            [
                "You received a new contact form submission.",
                "",
                f"Submission ID: {submission_id}",
                f"Received At: {received_at}",
                f"Name: {submission.name}",
                f"Email: {submission.email}",
                f"Subject: {submission.subject}",
                "",
                "Message:",
                submission.message,
            ]
        )
    )

    with smtplib.SMTP(smtp_host, smtp_port, timeout=30) as smtp:
        smtp.ehlo()
        if use_starttls:
            smtp.starttls()
            smtp.ehlo()
        if smtp_username:
            smtp.login(smtp_username, smtp_password)
        smtp.send_message(email_message)


def persist_submission(submission: ContactSubmission) -> tuple[str, str]:
    storage_path = get_storage_path()
    storage_path.parent.mkdir(parents=True, exist_ok=True)

    submission_id = str(uuid4())
    received_at = datetime.now(timezone.utc).isoformat()
    payload = {
        "id": submission_id,
        "received_at": received_at,
        **submission.model_dump(),
    }

    with storage_path.open("a", encoding="utf-8") as storage_file:
        storage_file.write(json.dumps(payload) + "\n")

    return submission_id, received_at


app = FastAPI(title="Portfolio Contact API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check() -> dict[str, bool | str]:
    return {
        "status": "ok",
        "email_delivery_enabled": email_delivery_enabled(),
    }


@app.post("/api/contact", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def submit_contact_form(submission: ContactSubmission) -> ContactResponse:
    try:
        submission_id, received_at = persist_submission(submission)
    except OSError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to store your message right now.",
        ) from error

    if email_delivery_enabled():
        try:
            send_submission_email(submission, submission_id, received_at)
        except (OSError, smtplib.SMTPException) as error:
            # Do not fail the request after persistence; email notifications are best-effort.
            logger.exception("Email notification failed for submission %s", submission_id)

    return ContactResponse(
        message="Message received successfully.",
        submission_id=submission_id,
        received_at=received_at,
    )
