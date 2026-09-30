from datetime import datetime
from typing import List
from app.models.schemas import NormalizedMessage, OverviewStats

def calculate_overview(messages: List[NormalizedMessage]) -> OverviewStats:
    if not messages:
        raise ValueError("Cannot calculate overview for empty messages list")

    total_messages = len(messages)
    first_msg = messages[0]
    last_msg = messages[-1]

    start_date = first_msg.date
    end_date = last_msg.date

    t1 = datetime.fromisoformat(first_msg.timestamp)
    t2 = datetime.fromisoformat(last_msg.timestamp)
    duration_days = max(1, (t2 - t1).days + 1)

    active_days_set = set(m.date for m in messages)
    active_days = len(active_days_set)

    participants_set = set(m.sender for m in messages)
    total_participants = len(participants_set)

    total_words = sum(m.wordCount for m in messages)
    total_chars = sum(m.characterCount for m in messages)

    avg_msgs_day = round(total_messages / active_days, 1) if active_days > 0 else 0.0
    avg_words_msg = round(total_words / total_messages, 1) if total_messages > 0 else 0.0
    avg_msg_len = round(total_chars / total_messages, 1) if total_messages > 0 else 0.0

    return OverviewStats(
        totalMessages=total_messages,
        totalParticipants=total_participants,
        activeDays=active_days,
        startDate=start_date,
        endDate=end_date,
        durationDays=duration_days,
        totalWords=total_words,
        totalCharacters=total_chars,
        avgMessagesPerDay=avg_msgs_day,
        avgWordsPerMessage=avg_words_msg,
        avgMessageLength=avg_msg_len
    )
