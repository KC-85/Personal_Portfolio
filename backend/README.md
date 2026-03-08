# FastAPI Contact Backend

This micro-backend accepts contact form submissions from the portfolio frontend.

## Endpoints

- `GET /api/health`
- `POST /api/contact`

## Local setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

The frontend is configured to submit to `/api/contact` in development through the Vite proxy.

## Environment variables

- `CONTACT_ALLOWED_ORIGINS`: comma-separated list of allowed origins for CORS
- `CONTACT_STORAGE_PATH`: file path for JSONL contact submissions
- `CONTACT_RECIPIENT_EMAIL`: inbox that should receive contact form emails
- `CONTACT_FROM_EMAIL`: sender address used for SMTP delivery
- `CONTACT_FROM_NAME`: display name used in the `From` header
- `CONTACT_SMTP_HOST`: SMTP server hostname
- `CONTACT_SMTP_PORT`: SMTP port, usually `587`
- `CONTACT_SMTP_USERNAME`: SMTP username
- `CONTACT_SMTP_PASSWORD`: SMTP password or app password
- `CONTACT_SMTP_USE_STARTTLS`: set to `true` for STARTTLS-enabled SMTP servers

If the SMTP variables are not configured, submissions are still stored locally but no email is sent.

## Health check

`GET /api/health` also returns whether email delivery is currently enabled.

## Stored data

Submissions are appended to `backend/data/contact_submissions.jsonl` by default.
