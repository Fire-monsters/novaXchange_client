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
from catalog.notifications.whatsapp import wa_link

settings = get_settings()
logger = logging.getLogger("catalog.notifications.emailer")

STATUS_MESSAGES = {
    "confirmed": "Your order has been confirmed and is being prepared.",
    "packed":    "Your order has been packed and is ready for dispatch.",
    "shipped":   "Your order is on its way!",
    "delivered": "Your order has been delivered. Thank you for shopping with novaXchange!",
    "cancelled": "Your order has been cancelled.",
}


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
    store_wa = wa_link(
        settings.admin_whatsapp,
        f"Hi novaXchange, I have a question about order {order['order_number']}.",
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
        f"Message us on WhatsApp: {store_wa}\n\n"
        f"— novaXchange"
    )
    send_email(order["customer"]["email"], f"Order confirmed — {order['order_number']}", body)


def send_admin_new_order_alert(order: dict) -> None:
    lines = "\n".join(
        f"  • {item['name']} × {item['quantity']} — UGX {item['subtotal_ugx']:,}"
        for item in order["items"]
    )
    customer_wa = wa_link(
        order["customer"]["whatsapp"],
        f"Hi {order['customer']['name']}, this is novaXchange regarding your order {order['order_number']}.",
    )
    self_wa = wa_link(
        settings.admin_whatsapp,
        f"New order {order['order_number']} — {order['customer']['name']}, UGX {order['total_ugx']:,}\n{lines}",
    )
    body = (
        f"New COD order placed.\n\n"
        f"Order number: {order['order_number']}\n"
        f"Customer: {order['customer']['name']} ({order['customer']['whatsapp']}, {order['customer']['email']})\n"
        f"Address: {order['customer']['address']}\n"
        f"Notes: {order['customer'].get('notes') or '—'}\n\n"
        f"{lines}\n\n"
        f"Total: UGX {order['total_ugx']:,}\n\n"
        f"Message customer on WhatsApp: {customer_wa}\n"
        f"Save to my WhatsApp: {self_wa}"
    )
    send_email(settings.admin_email, f"New order — {order['order_number']}", body)


def send_order_status_email(order: dict, new_status: str) -> None:
    message = STATUS_MESSAGES.get(new_status)
    if not message:
        return
    body = (
        f"Hi {order['customer']['name']},\n\n"
        f"{message}\n\n"
        f"Order number: {order['order_number']}\n"
        f"Status: {new_status.capitalize()}\n\n"
        f"— novaXchange"
    )
    send_email(order["customer"]["email"], f"Order {new_status} — {order['order_number']}", body)


def send_admin_new_customer_alert(user: dict) -> None:
    body = (
        f"New customer account created.\n\n"
        f"Name: {user['name']}\n"
        f"Email: {user['email']}\n"
        f"WhatsApp: {user.get('whatsapp') or '—'}\n"
        f"Sign-up method: {user.get('auth_provider', 'password')}"
    )
    send_email(settings.admin_email, f"New customer — {user['name']}", body)


def send_welcome_email(user: dict) -> None:
    body = (
        f"Hi {user['name']},\n\n"
        f"Your novaXchange account is ready. You can now log in to track orders "
        f"and skip re-entering your delivery details at checkout.\n\n"
        f"— novaXchange"
    )
    send_email(user["email"], "Welcome to novaXchange", body)
