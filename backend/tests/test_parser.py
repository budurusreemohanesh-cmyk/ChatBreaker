import pytest
from app.parser.whatsapp_parser import parse_whatsapp_text

SAMPLE_CHAT_HYPHEN = """12/03/2026, 10:14 - Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
12/03/2026, 10:15 - Paula: Hey Liam! Quick coffee? ☕
12/03/2026, 10:16 - Liam: Absolutely!
12/03/2026, 10:18 - Paula: Awesome.
"""

SAMPLE_CHAT_MULTILINE = """28/09/2026, 22:32 - Paula: Line one
Line two
Line three
28/09/2026, 22:33 - Liam: Got all three lines!
"""

SAMPLE_CHAT_BRACKETED = """[10/01/2026, 09:30:15] Messages and calls are end-to-end encrypted.
[10/01/2026, 09:31:00] Maya: Hey team! 🚀
[10/01/2026, 09:32:10] Alex: Ready to launch!
"""

def test_parse_hyphen_format():
    messages, sys_count, err_count = parse_whatsapp_text(SAMPLE_CHAT_HYPHEN)
    assert len(messages) == 3
    assert sys_count >= 1
    assert messages[0].sender == "Paula"
    assert messages[0].message == "Hey Liam! Quick coffee? ☕"
    assert messages[0].date == "2026-03-12"
    assert messages[0].hour == 10
    assert messages[1].sender == "Liam"

def test_parse_multiline():
    messages, _, _ = parse_whatsapp_text(SAMPLE_CHAT_MULTILINE)
    assert len(messages) == 2
    assert "Line one\nLine two\nLine three" in messages[0].message
    assert messages[0].wordCount == 6
    assert messages[1].sender == "Liam"

def test_parse_bracketed_ios():
    messages, sys_count, _ = parse_whatsapp_text(SAMPLE_CHAT_BRACKETED)
    assert len(messages) == 2
    assert sys_count >= 1
    assert messages[0].sender == "Maya"
    assert messages[1].sender == "Alex"

def test_system_message_filtering():
    raw = """12/03/2026, 10:14 - Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
12/03/2026, 10:15 - Paula: Hello!
12/03/2026, 10:16 - Liam added Sophie
12/03/2026, 10:17 - Sophie joined using this group's invite link
12/03/2026, 10:18 - Liam: Welcome Sophie!
"""
    messages, sys_count, _ = parse_whatsapp_text(raw)
    assert len(messages) == 2
    assert messages[0].sender == "Paula"
    assert messages[1].sender == "Liam"
