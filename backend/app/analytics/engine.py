from typing import List
from app.models.schemas import (
    NormalizedMessage,
    ConversationAnalytics,
    AIInsightFact,
)
from app.analytics.overview import calculate_overview
from app.analytics.activity import calculate_activity
from app.analytics.replies import calculate_replies_and_starters
from app.analytics.streaks import calculate_streaks
from app.analytics.words import calculate_words_and_phrases
from app.analytics.emojis import calculate_emojis
from app.analytics.timeline import calculate_timeline_and_artifacts
from app.analytics.participants import calculate_participants

def run_analytics(
    messages: List[NormalizedMessage],
    threshold_hours: int = 3
) -> ConversationAnalytics:
    if not messages:
        raise ValueError("Cannot run analytics on empty messages")

    # Ensure chronological order
    sorted_messages = sorted(messages, key=lambda m: m.timestamp)

    overview = calculate_overview(sorted_messages)
    activity = calculate_activity(sorted_messages)
    replies, starters = calculate_replies_and_starters(sorted_messages, threshold_hours)
    streaks = calculate_streaks(sorted_messages)
    words, phrases = calculate_words_and_phrases(sorted_messages)
    emojis = calculate_emojis(sorted_messages)
    timeline, longest, links, media = calculate_timeline_and_artifacts(sorted_messages)
    participants = calculate_participants(sorted_messages, starters, replies, longest, emojis, links, media)

    # Generate fact-grounded editorial observations
    insights = []
    if participants:
        top_p = participants[0]
        insights.append(AIInsightFact(
            type="dynamics",
            headline=f"{top_p.name} holds the conversation lead",
            description=f"{top_p.name} contributed {top_p.percentage}% of all messages ({top_p.messageCount:,} total messages).",
            metric=f"{top_p.percentage}% share"
        ))

    peak_h = activity.peakHour
    peak_str = "12 AM" if peak_h == 0 else f"{peak_h - 12} PM" if peak_h > 12 else f"{peak_h} AM"
    is_late = peak_h >= 21 or peak_h <= 3
    insights.append(AIInsightFact(
        type="rhythm",
        headline="Late night conversations dominate" if is_late else "Daytime is your peak active window",
        description=f"Activity consistently peaks around {peak_str}. {activity.nightOwlPercentage}% of all messages were sent after 10 PM.",
        metric=f"Peak at {peak_str}"
    ))

    if starters.starters:
        lead_starter = starters.starters[0]
        insights.append(AIInsightFact(
            type="habits",
            headline=f"{lead_starter.name} frequently breaks the silence",
            description=f"With a {threshold_hours}-hour inactivity threshold, {lead_starter.name} initiated {lead_starter.percentage}% of all conversations ({lead_starter.count} times).",
            metric=f"{lead_starter.count} starts"
        ))

    if replies.overallMedianMinutes > 0:
        med = replies.overallMedianMinutes
        speed_desc = (
            "Rapid-fire responses: you exchange messages almost in real time."
            if med <= 2
            else "A steady conversational pace with quick turnarounds."
            if med <= 15
            else "An asynchronous conversation where participants reply when convenient."
        )
        insights.append(AIInsightFact(
            type="rhythm",
            headline=f"Median response time is {round(med)} min",
            description=speed_desc,
            metric=f"{round(med)}m median"
        ))

    if streaks.longestStreakDays > 1:
        insights.append(AIInsightFact(
            type="habits",
            headline=f"{streaks.longestStreakDays}-day streak of non-stop chatting",
            description=f"The conversation remained active for {streaks.longestStreakDays} consecutive days without a single day of silence.",
            metric=f"{streaks.longestStreakDays} days"
        ))

    if emojis.topEmojis:
        top_emo = emojis.topEmojis[0]
        insights.append(AIInsightFact(
            type="language",
            headline=f"{top_emo.emoji} is your hallmark reaction",
            description=f"Used {top_emo.count:,} times across the conversation.",
            metric=f"{top_emo.count}x"
        ))

    return ConversationAnalytics(
        overview=overview,
        participants=participants,
        activity=activity,
        replyTimes=replies,
        conversationStarters=starters,
        streaks=streaks,
        words=words,
        phrases=phrases,
        emojis=emojis,
        longestMessages=longest,
        links=links,
        media=media,
        timeline=timeline,
        aiInsights=insights
    )
