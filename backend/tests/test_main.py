import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

from backend.main import (
    ContactSubmission,
    storage_enabled,
    submit_contact_form,
)


def example_submission() -> ContactSubmission:
    return ContactSubmission(
        name="Kristian Cross",
        email="kristian@example.com",
        subject="Portfolio enquiry",
        message="I would like to discuss a project with you.",
    )


class ContactDeliveryTests(unittest.TestCase):
    def test_storage_defaults_to_disabled_on_vercel(self) -> None:
        with patch.dict(os.environ, {"VERCEL": "1"}, clear=True):
            self.assertFalse(storage_enabled())

    def test_storage_can_be_explicitly_enabled_on_vercel(self) -> None:
        with patch.dict(
            os.environ,
            {"VERCEL": "1", "CONTACT_STORAGE_ENABLED": "true"},
            clear=True,
        ):
            self.assertTrue(storage_enabled())

    def test_vercel_rejects_a_submission_when_delivery_is_not_configured(self) -> None:
        with patch.dict(os.environ, {"VERCEL": "1"}, clear=True):
            with self.assertRaises(HTTPException) as context:
                submit_contact_form(example_submission())

        self.assertEqual(context.exception.status_code, 503)
        self.assertEqual(
            context.exception.detail,
            "Contact delivery is temporarily unavailable.",
        )

    @patch("backend.main.send_submission_email")
    def test_vercel_delivers_by_email_without_writing_to_disk(self, send_email) -> None:
        environment = {
            "VERCEL": "1",
            "CONTACT_RECIPIENT_EMAIL": "owner@example.com",
            "CONTACT_SMTP_HOST": "smtp.example.com",
            "CONTACT_FROM_EMAIL": "portfolio@example.com",
        }

        with patch.dict(os.environ, environment, clear=True):
            response = submit_contact_form(example_submission())

        self.assertEqual(response.message, "Message received successfully.")
        send_email.assert_called_once()

    def test_local_development_persists_submissions(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            storage_path = Path(temporary_directory) / "submissions.jsonl"
            with patch.dict(
                os.environ,
                {"CONTACT_STORAGE_PATH": str(storage_path)},
                clear=True,
            ):
                response = submit_contact_form(example_submission())

            saved_submission = json.loads(storage_path.read_text(encoding="utf-8"))

        self.assertEqual(saved_submission["id"], response.submission_id)
        self.assertEqual(saved_submission["email"], "kristian@example.com")


if __name__ == "__main__":
    unittest.main()
