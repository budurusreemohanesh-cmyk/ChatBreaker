import uuid
from typing import List, Tuple
from app.models.schemas import NormalizedMessage
from app.parser.formats import (
    IOS_BRACKETED_REGEX,
    STANDARD_REGEX,
    SYSTEM_BRACKETED_REGEX,
    SYSTEM_STANDARD_REGEX,
    SYSTEM_PHRASES,
    MEDIA_PHRASES,
)
from app.parser.normalizer import infer_date_format, normalize_date, normalize_time

def is_system_message(sender: str, message: str) -> bool:
    combined = f"{sender} {message}".lower()
    return any(phrase in combined for phrase in SYSTEM_PHRASES)

def is_media_message(message: str) -> bool:
    lower = message.strip().lower()
    return any(phrase in lower for phrase in MEDIA_PHRASES)

def parse_whatsapp_text(raw_text: str) -> Tuple[List[NormalizedMessage], int, int]:
    """
    Parses WhatsApp chat export text.
    Returns (messages, system_message_count, error_count)
    """
    if not raw_text or not raw_text.strip():
        return [], 0, 0

    sanitized = raw_text.lstrip("\ufeff")
    lines = sanitized.splitlines()
    date_fmt = infer_date_format(lines)

    messages: List[NormalizedMessage] = []
    current_dict = None
    system_count = 0
    errors_count = 0

    def finalize_msg(d: dict) -> NormalizedMessage:
        text = d["message"].strip()
        words = [w for w in text.split() if w]
        return NormalizedMessage(
            id=d["id"],
            timestamp=d["timestamp"],
            sender=d["sender"],
            message=text,
            date=d["date"],
            hour=d["hour"],
            wordCount=len(words),
            characterCount=len(text),
            isMedia=d.get("isMedia", False)
        )

    for line in lines:
        if not line.strip() and not current_dict:
            continue

        # Try iOS bracketed format
        match = IOS_BRACKETED_REGEX.match(line)
        if not match:
            # Try Android/Standard format
            match = STANDARD_REGEX.match(line)

        if match:
            if current_dict:
                messages.append(finalize_msg(current_dict))
                current_dict = None

            raw_date, raw_time, raw_sender, raw_content = match.groups()
            norm_date = normalize_date(raw_date, date_fmt)
            norm_time = normalize_time(raw_time)

            if not norm_date or not norm_time:
                errors_count += 1
                continue

            sender = raw_sender.strip()
            content = raw_content or ""

            if is_system_message(sender, content):
                system_count += 1
                continue

            hour, _, _, time24 = norm_time
            timestamp = f"{norm_date}T{time24}"

            current_dict = {
                "id": str(uuid.uuid4()),
                "timestamp": timestamp,
                "date": norm_date,
                "hour": hour,
                "sender": sender,
                "message": content,
                "isMedia": is_media_message(content)
            }
            continue

        # System line check (no sender)
        if SYSTEM_BRACKETED_REGEX.match(line) or SYSTEM_STANDARD_REGEX.match(line):
            if current_dict:
                messages.append(finalize_msg(current_dict))
                current_dict = None
            system_count += 1
            continue

        # Continuation of multiline message
        if current_dict:
            current_dict["message"] = current_dict["message"] + "\n" + line
            if is_media_message(current_dict["message"]):
                current_dict["isMedia"] = True

    if current_dict:
        messages.append(finalize_msg(current_dict))

    return messages, system_count, errors_count
