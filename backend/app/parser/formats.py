import re

# Format 1: [DD/MM/YY, HH:MM:SS] Sender: Message (iOS)
IOS_BRACKETED_REGEX = re.compile(
    r"^\[(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?)\]\s+([^:]+):\s*(.*)$",
    re.IGNORECASE
)

# Format 2: DD/MM/YYYY, HH:MM - Sender: Message (Android / Standard)
STANDARD_REGEX = re.compile(
    r"^(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?)\s*(?:-|–|—)\s*([^:]+):\s*(.*)$",
    re.IGNORECASE
)

# System message patterns
SYSTEM_BRACKETED_REGEX = re.compile(
    r"^\[(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?)\]\s+(.*)$",
    re.IGNORECASE
)

SYSTEM_STANDARD_REGEX = re.compile(
    r"^(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?)\s*(?:-|–|—)\s*(.*)$",
    re.IGNORECASE
)

SYSTEM_PHRASES = [
    "messages and calls are end-to-end encrypted",
    "message was deleted",
    "deleted this message",
    "changed the group description",
    "changed the subject",
    "created group",
    "added",
    "left",
    "joined using this group's invite link",
    "security code changed",
    "you're now an admin",
    "changed their phone number",
    "disappearing messages",
]

MEDIA_PHRASES = [
    "<media omitted>",
    "image omitted",
    "video omitted",
    "audio omitted",
    "document omitted",
    "sticker omitted",
    "contact card omitted",
    "gif omitted",
    "attached:",
]
