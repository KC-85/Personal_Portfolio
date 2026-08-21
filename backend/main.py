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


def storage_enabled() -> bool:
    configured = os.getenv("CONTACT_STORAGE_ENABLED")
    if configured is not None:
        return env_flag("CONTACT_STORAGE_ENABLED")

    # Vercel Functions have an ephemeral filesystem. Default to email-only
    # delivery there, while retaining JSONL storage for local development.
    return not env_flag("VERCEL")


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
    smtp_username = os.getenv("CONTACT_SMTP_USERNAME", "").strip()
    smtp_password = os.getenv("CONTACT_SMTP_PASSWORD", "").strip()
    from_name = os.getenv("CONTACT_FROM_NAME", "Portfolio Contact Form").strip()
    use_starttls = env_flag("CONTACT_SMTP_USE_STARTTLS", True)

    # Parse SMTP port safely
    try:
        smtp_port = int(os.getenv("CONTACT_SMTP_PORT", "587"))
    except ValueError:
        logger.error("Invalid CONTACT_SMTP_PORT value, using default 587")
        smtp_port = 587

    # Validate required configuration
    if not recipient_email or not smtp_host or not from_email:
        logger.error(
            "Email delivery misconfigured. Missing required environment variables: "
            "recipient_email=%s, smtp_host=%s, from_email=%s",
            "✓" if recipient_email else "✗",
            "✓" if smtp_host else "✗",
            "✓" if from_email else "✗",
        )
        return

    # Security: Require STARTTLS if credentials are provided
    if (smtp_username or smtp_password) and not use_starttls:
        logger.error(
            "Insecure email configuration: STARTTLS required when credentials are provided. "
            "Set CONTACT_SMTP_USE_STARTTLS=true or remove credentials."
        )
        return

    # Build email message
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

    # Send email with detailed error context
    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=30) as smtp:
            try:
                smtp.ehlo()
            except smtplib.SMTPException as e:
                logger.error("SMTP EHLO failed: %s", str(e))
                raise

            if use_starttls:
                try:
                    smtp.starttls()
                    smtp.ehlo()
                except smtplib.SMTPException as e:
                    logger.error("SMTP STARTTLS negotiation failed: %s", str(e))
                    raise

            if smtp_username:
                try:
                    smtp.login(smtp_username, smtp_password)
                except smtplib.SMTPAuthenticationError as e:
                    logger.error("SMTP authentication failed for user %s: %s", smtp_username, str(e))
                    raise
                except smtplib.SMTPException as e:
                    logger.error("SMTP login error: %s", str(e))
                    raise

            try:
                smtp.send_message(email_message)
            except smtplib.SMTPException as e:
                logger.error("SMTP send failed: %s", str(e))
                raise
    except (smtplib.SMTPException, OSError) as e:
        logger.exception("Email delivery failed for submission %s: %s", submission_id, str(e))
        raise


def create_submission_metadata() -> tuple[str, str]:
    return str(uuid4()), datetime.now(timezone.utc).isoformat()


def persist_submission(
    submission: ContactSubmission,
    submission_id: str,
    received_at: str,
) -> None:
    storage_path = get_storage_path()
    storage_path.parent.mkdir(parents=True, exist_ok=True)

    payload = {
        "id": submission_id,
        "received_at": received_at,
        **submission.model_dump(),
    }

    with storage_path.open("a", encoding="utf-8") as storage_file:
        storage_file.write(json.dumps(payload) + "\n")


app = FastAPI(
    title="Portfolio Contact API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

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
        "storage_enabled": storage_enabled(),
    }


@app.post("/api/contact", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def submit_contact_form(submission: ContactSubmission) -> ContactResponse:
    should_store = storage_enabled()
    should_email = email_delivery_enabled()

    if not should_store and not should_email:
        logger.error("Contact delivery is not configured")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Contact delivery is temporarily unavailable.",
        )

    submission_id, received_at = create_submission_metadata()
    submission_persisted = False

    if should_store:
        try:
            persist_submission(submission, submission_id, received_at)
            submission_persisted = True
            logger.info("Submission persisted: %s", submission_id)
        except OSError as error:
            if not should_email:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Unable to store your message right now.",
                ) from error
            logger.exception("Submission persistence failed: %s", submission_id)

    if should_email:
        try:
            send_submission_email(submission, submission_id, received_at)
            logger.info("Email notification sent for submission %s", submission_id)
        except (OSError, smtplib.SMTPException) as error:
            logger.exception("Email notification failed for submission %s", submission_id)
            detail = (
                "Message saved but email delivery failed."
                if submission_persisted
                else "Unable to deliver your message right now."
            )
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=detail,
            ) from error

    return ContactResponse(
        message="Message received successfully.",
        submission_id=submission_id,
        received_at=received_at,
    )
