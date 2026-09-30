from datetime import datetime
from typing import List, Dict
from app.models.schemas import (
    NormalizedMessage,
    ActivityStats,
    HourActivityItem,
    DayOfWeekActivityItem,
    BusiestDayItem,
)

DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

def calculate_activity(messages: List[NormalizedMessage]) -> ActivityStats:
    total_messages = len(messages)
    hour_counts = [0] * 24
    day_counts = [0] * 7
    calendar_heatmap: Dict[str, int] = {}
    participant_by_hour: Dict[str, List[int]] = {}

    for m in messages:
        if m.sender not in participant_by_hour:
            participant_by_hour[m.sender] = [0] * 24

        if 0 <= m.hour < 24:
            hour_counts[m.hour] += 1
            participant_by_hour[m.sender][m.hour] += 1

        calendar_heatmap[m.date] = calendar_heatmap.get(m.date, 0) + 1

        dt = datetime.strptime(m.date, "%Y-%m-%d")
        day_counts[dt.weekday()] += 1

    peak_hour = int(max(range(24), key=lambda h: hour_counts[h]))
    quiet_hour = int(min(range(24), key=lambda h: hour_counts[h]))

    late_night = sum(hour_counts[h] for h in [22, 23, 0, 1, 2, 3])
    night_owl_pct = round((late_night / total_messages) * 100.0, 1) if total_messages > 0 else 0.0

    by_hour = [
        HourActivityItem(
            hour=h,
            count=hour_counts[h],
            percentage=round((hour_counts[h] / total_messages) * 100.0, 1) if total_messages > 0 else 0.0
        )
        for h in range(24)
    ]

    total_days = max(1, len(calendar_heatmap))
    est_weeks = max(1.0, total_days / 7.0)

    by_day_of_week = [
        DayOfWeekActivityItem(
            day=DAYS_OF_WEEK[i],
            dayIndex=i,
            count=day_counts[i],
            average=round(day_counts[i] / est_weeks, 1)
        )
        for i in range(7)
    ]

    busiest_day_idx = int(max(range(7), key=lambda i: day_counts[i]))
    quietest_day_idx = int(min(range(7), key=lambda i: day_counts[i]))

    sorted_dates = sorted(calendar_heatmap.items(), key=lambda x: x[1], reverse=True)
    busiest_days = [
        BusiestDayItem(
            date=d,
            count=c,
            formattedDate=datetime.strptime(d, "%Y-%m-%d").strftime("%d %b %Y")
        )
        for d, c in sorted_dates[:10]
    ]

    return ActivityStats(
        byHour=by_hour,
        byDayOfWeek=by_day_of_week,
        peakHour=peak_hour,
        quietHour=quiet_hour,
        nightOwlPercentage=night_owl_pct,
        busiestDayOfWeek=DAYS_OF_WEEK[busiest_day_idx],
        quietestDayOfWeek=DAYS_OF_WEEK[quietest_day_idx],
        calendarHeatmap=calendar_heatmap,
        busiestDays=busiest_days,
        participantByHour=participant_by_hour
    )
