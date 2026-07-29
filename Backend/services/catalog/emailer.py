"""
emailer.py — shared best-effort email sending for orders + customer accounts
─────────────────────────────────────────────────────────────────────────────
Mirrors the SMTP + silent-no-op-if-unconfigured behavior already used by
routers/admin_auth.py's _send_verification_email, as a reusable helper so
order confirmations, admin alerts, and welcome emails don't each duplicate
the same smtplib boilerplate. Does not touch admin_auth.py.
─────────────────────────────────────────────────────────────────────────────
"""

import logging
import smtplib
from email.message import EmailMessage

from catalog.config import get_settings

settings = get_settings()
logger = logging.getLogger("catalog.emailer")


def send_email(to: str, subject: str, body: str) -> bool:
    """Best-effort send — returns False (and logs) instead of raising, so a
    notification failure never turns a successful order/registration into
    an error response."""
    if not settings.smtp_host or not settings.smtp_username or not settings.smtp_password:
        logger.info("SMTP not configured — skipping email to %s (%s)", to, subject)
        return False

    from_email = settings.smtp_from_email or settings.smtp_username
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = from_email
    message["To"] = to
    message.set_content(body)

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
            if settings.smtp_use_tls:
                server.starttls()
            server.login(settings.smtp_username, settings.smtp_password)
            server.send_message(message)
        return True
    except Exception as e:
        logger.error("Failed to send email to %s (%s): %s", to, subject, e)
        return False


def send_order_confirmation_email(order: dict) -> None:
    lines = "\n".join(
        f"  • {item['name']} × {item['quantity']} — UGX {item['subtotal_ugx']:,}"
        for item in order["items"]
    )
    body = (
        f"Hi {order['customer']['name']},\n\n"
        f"Thanks for your order! Here's a summary:\n\n"
        f"Order number: {order['order_number']}\n"
        f"{lines}\n\n"
        f"Total: UGX {order['total_ugx']:,}\n"
        f"Delivery address: {order['customer']['address']}\n\n"
        f"This is a Cash on Delivery order — pay when it arrives.\n"
        f"We'll be in touch on WhatsApp ({order['customer']['whatsapp']}) to confirm details.\n\n"
        f"— novaXchange"
    )
    send_email(order["customer"]["email"], f"Order confirmed — {order['order_number']}", body)


def send_admin_new_order_alert(order: dict) -> None:
    lines = "\n".join(
        f"  • {item['name']} × {item['quantity']} — UGX {item['subtotal_ugx']:,}"
        for item in order["items"]
    )
    body = (
        f"New COD order placed.\n\n"
        f"Order number: {order['order_number']}\n"
        f"Customer: {order['customer']['name']} ({order['customer']['whatsapp']}, {order['customer']['email']})\n"
        f"Address: {order['customer']['address']}\n"
        f"Notes: {order['customer'].get('notes') or '—'}\n\n"
        f"{lines}\n\n"
        f"Total: UGX {order['total_ugx']:,}"
    )
    send_email(settings.admin_email, f"New order — {order['order_number']}", body)


def send_welcome_email(user: dict) -> None:
    body = (
        f"Hi {user['name']},\n\n"
        f"Your novaXchange account is ready. You can now log in to track orders "
        f"and skip re-entering your delivery details at checkout.\n\n"
        f"— novaXchange"
    )
    send_email(user["email"], "Welcome to novaXchange", body)
