from datetime import datetime
from typing import List, Set
from app.models.schemas import NormalizedMessage, StreakStats

def calculate_streaks(messages: List[NormalizedMessage]) -> StreakStats:
    if not messages:
        return StreakStats(
            longestStreakDays=0,
            longestStreakStart="",
            longestStreakEnd="",
            currentStreakDays=0,
            longestSilenceDays=0,
            longestSilenceStart="",
            longestSilenceEnd="",
            avgGapDays=0.0
        )

    dates: List[str] = sorted(list(set(m.date for m in messages)))
    if len(dates) == 1:
        return StreakStats(
            longestStreakDays=1,
            longestStreakStart=dates[0],
            longestStreakEnd=dates[0],
            currentStreakDays=1,
            longestSilenceDays=0,
            longestSilenceStart="",
            longestSilenceEnd="",
            avgGapDays=0.0
        )

    longest_streak = 1
    current_run = 1
    streak_start = dates[0]
    streak_end = dates[0]
    best_start = dates[0]
    best_end = dates[0]

    longest_silence = 0
    silence_start = ""
    silence_end = ""
    gaps: List[int] = []

    for i in range(1, len(dates)):
        d_prev = datetime.strptime(dates[i - 1], "%Y-%m-%d")
        d_curr = datetime.strptime(dates[i], "%Y-%m-%d")
        diff = (d_curr - d_prev).days

        if diff == 1:
            current_run += 1
            streak_end = dates[i]
            if current_run > longest_streak:
                longest_streak = current_run
                best_start = streak_start
                best_end = streak_end
        else:
            current_run = 1
            streak_start = dates[i]
            streak_end = dates[i]

            gap = diff - 1
            gaps.append(gap)
            if gap > longest_silence:
                longest_silence = gap
                silence_start = dates[i - 1]
                silence_end = dates[i]

    avg_gap = round(sum(gaps) / len(gaps), 1) if gaps else 0.0

    return StreakStats(
        longestStreakDays=longest_streak,
        longestStreakStart=best_start,
        longestStreakEnd=best_end,
        currentStreakDays=current_run,
        longestSilenceDays=longest_silence,
        longestSilenceStart=silence_start,
        longestSilenceEnd=silence_end,
        avgGapDays=avg_gap
    )
