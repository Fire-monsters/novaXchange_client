"""
whatsapp.py — click-to-chat wa.me link builder
─────────────────────────────────────────────────────────────────────────────
No WhatsApp Business API/Twilio credentials exist for this project, so
messages aren't sent server-side — instead, emails and the admin panel embed
a wa.me link pre-filled with the message text, which whoever clicks it
(the admin, from their own logged-in WhatsApp) actually sends.
─────────────────────────────────────────────────────────────────────────────
"""

from urllib.parse import quote


def normalize_ug_number(raw: str) -> str:
    """Best-effort normalization of the common formats seen in
    customer.whatsapp / user.whatsapp (e.g. "07XXXXXXXX", "+2567XXXXXXXX",
    "2567XXXXXXXX") into the digits-only, country-code-prefixed form wa.me
    requires."""
    digits = "".join(c for c in raw if c.isdigit())
    if digits.startswith("256"):
        return digits
    if digits.startswith("0"):
        return "256" + digits[1:]
    return digits


def wa_link(raw_number: str, text: str) -> str:
    return f"https://wa.me/{normalize_ug_number(raw_number)}?text={quote(text)}"
