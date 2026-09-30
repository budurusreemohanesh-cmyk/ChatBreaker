from datetime import datetime
from typing import List, Dict, Tuple
import numpy as np
from app.models.schemas import (
    NormalizedMessage,
    ReplyTimeStats,
    ParticipantReplyStats,
    ConversationStarterStats,
    StarterItem,
)

def calculate_replies_and_starters(
    messages: List[NormalizedMessage],
    threshold_hours: int = 3
) -> Tuple[ReplyTimeStats, ConversationStarterStats]:
    if not messages:
        return (
            ReplyTimeStats(
                overallMedianMinutes=0.0,
                overallAvgMinutes=0.0,
                fastestReplySeconds=0,
                longestGapHours=0.0,
                byParticipant={}
            ),
            ConversationStarterStats(
                thresholdHours=threshold_hours,
                totalConversations=0,
                starters=[]
            )
        )

    threshold_seconds = threshold_hours * 3600
    starters_count: Dict[str, int] = {}
    reply_gaps: List[float] = []
    participant_reply_gaps: Dict[str, List[float]] = {}
    fastest_reply_seconds = float("inf")
    longest_gap_hours = 0.0

    # First message starts conversation #1
    starters_count[messages[0].sender] = 1
    total_conversations = 1

    for i in range(1, len(messages)):
        prev = messages[i - 1]
        curr = messages[i]

        t_prev = datetime.fromisoformat(prev.timestamp)
        t_curr = datetime.fromisoformat(curr.timestamp)
        diff_seconds = (t_curr - t_prev).total_seconds()

        if diff_seconds > threshold_seconds:
            total_conversations += 1
            starters_count[curr.sender] = starters_count.get(curr.sender, 0) + 1

        gap_hours = diff_seconds / 3600.0
        if gap_hours > longest_gap_hours:
            longest_gap_hours = gap_hours

        # Reply: different sender and gap < 24 hours
        if curr.sender != prev.sender and 0 < diff_seconds < 86400:
            gap_minutes = diff_seconds / 60.0
            reply_gaps.append(gap_minutes)

            if diff_seconds < fastest_reply_seconds:
                fastest_reply_seconds = diff_seconds

            if curr.sender not in participant_reply_gaps:
                participant_reply_gaps[curr.sender] = []
            participant_reply_gaps[curr.sender].append(gap_minutes)

    overall_median = round(float(np.median(reply_gaps)), 1) if reply_gaps else 0.0
    overall_avg = round(float(np.mean(reply_gaps)), 1) if reply_gaps else 0.0
    fastest_sec = int(round(fastest_reply_seconds)) if fastest_reply_seconds != float("inf") else 0

    by_participant: Dict[str, ParticipantReplyStats] = {}
    for sender, gaps in participant_reply_gaps.items():
        by_participant[sender] = ParticipantReplyStats(
            medianMinutes=round(float(np.median(gaps)), 1),
            avgMinutes=round(float(np.mean(gaps)), 1),
            count=len(gaps)
        )

    reply_stats = ReplyTimeStats(
        overallMedianMinutes=overall_median,
        overallAvgMinutes=overall_avg,
        fastestReplySeconds=fastest_sec,
        longestGapHours=round(longest_gap_hours, 1),
        byParticipant=by_participant
    )

    starters_list = [
        StarterItem(
            name=name,
            count=count,
            percentage=round((count / total_conversations) * 100.0, 1)
        )
        for name, count in starters_count.items()
    ]
    starters_list.sort(key=lambda x: x.count, reverse=True)

    starter_stats = ConversationStarterStats(
        thresholdHours=threshold_hours,
        totalConversations=total_conversations,
        starters=starters_list
    )

    return reply_stats, starter_stats
