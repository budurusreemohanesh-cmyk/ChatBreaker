import pytest
from app.parser.whatsapp_parser import parse_whatsapp_text
from app.analytics.engine import run_analytics

SAMPLE_DATA = """12/03/2026, 10:15 - Paula: Good morning Liam! Are you awake? ☀️
12/03/2026, 10:16 - Liam: Good morning Paula! Just having coffee ☕
12/03/2026, 10:20 - Paula: Shall we discuss the project roadmap?
12/03/2026, 10:22 - Liam: Yes, let's review the designs first.
12/03/2026, 16:30 - Liam: Hey Paula, following up on that design review after 6 hours.
12/03/2026, 16:32 - Paula: Perfect timing, I just finished the mockups! 😍
13/03/2026, 09:00 - Paula: New day, new sprint! 🚀
14/03/2026, 11:00 - Liam: Weekend check-in!
"""

def test_analytics_overview():
    messages, _, _ = parse_whatsapp_text(SAMPLE_DATA)
    analytics = run_analytics(messages, threshold_hours=3)

    assert analytics.overview.totalMessages == 8
    assert analytics.overview.totalParticipants == 2
    assert analytics.overview.activeDays == 3
    assert analytics.overview.startDate == "2026-03-12"
    assert analytics.overview.endDate == "2026-03-14"

def test_conversation_starters():
    messages, _, _ = parse_whatsapp_text(SAMPLE_DATA)
    analytics = run_analytics(messages, threshold_hours=3)

    # 1. 10:15 by Paula (start #1)
    # 2. 16:30 by Liam (gap is ~6.16 hours > 3h threshold -> start #2)
    # 3. 13/03 09:00 by Paula (gap > 3h -> start #3)
    # 4. 14/03 11:00 by Liam (gap > 3h -> start #4)
    assert analytics.conversationStarters.totalConversations == 4
    starters = {s.name: s.count for s in analytics.conversationStarters.starters}
    assert starters["Paula"] == 2
    assert starters["Liam"] == 2

def test_reply_times():
    messages, _, _ = parse_whatsapp_text(SAMPLE_DATA)
    analytics = run_analytics(messages, threshold_hours=3)

    assert analytics.replyTimes.overallMedianMinutes > 0
    assert analytics.replyTimes.fastestReplySeconds <= 120

def test_streaks():
    messages, _, _ = parse_whatsapp_text(SAMPLE_DATA)
    analytics = run_analytics(messages, threshold_hours=3)

    # 2026-03-12, 2026-03-13, 2026-03-14 are 3 consecutive days!
    assert analytics.streaks.longestStreakDays == 3
    assert analytics.streaks.longestStreakStart == "2026-03-12"
    assert analytics.streaks.longestStreakEnd == "2026-03-14"

def test_emojis_and_words():
    messages, _, _ = parse_whatsapp_text(SAMPLE_DATA)
    analytics = run_analytics(messages, threshold_hours=3)

    emojis_found = [e.emoji for e in analytics.emojis.topEmojis]
    assert "☀️" in emojis_found or "☕" in emojis_found or "😍" in emojis_found

    top_words = [w.word for w in analytics.words.topWords]
    assert any(w in top_words for w in ["morning", "design", "designs", "review", "roadmap"])
