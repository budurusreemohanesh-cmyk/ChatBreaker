import re
from typing import Optional, Tuple, Dict, Any

def infer_date_format(lines: list[str]) -> str:
    """Infer DMY vs MDY from samples where day/month > 12"""
    first_over_12 = 0
    second_over_12 = 0

    date_re = re.compile(r"^\[?(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})")
    for line in lines[:300]:
        match = date_re.match(line)
        if match:
            p1, p2 = int(match.group(1)), int(match.group(2))
            if p1 > 12:
                first_over_12 += 1
            if p2 > 12:
                second_over_12 += 1

    if second_over_12 > 0 and first_over_12 == 0:
        return "MDY"
    return "DMY"

def normalize_date(date_str: str, fmt: str = "DMY") -> Optional[str]:
    parts = re.split(r"[./-]", date_str)
    if len(parts) != 3:
        return None

    try:
        raw_year = int(parts[2])
        year = (1900 + raw_year if raw_year > 50 else 2000 + raw_year) if raw_year < 100 else raw_year

        if fmt == "MDY":
            month = int(parts[0])
            day = int(parts[1])
        else:
            day = int(parts[0])
            month = int(parts[1])

        if not (1 <= month <= 12 and 1 <= day <= 31):
            return None

        return f"{year:04d}-{month:02d}-{day:02d}"
    except (ValueError, IndexError):
        return None

def normalize_time(time_str: str) -> Optional[Tuple[int, int, int, str]]:
    clean = time_str.replace("\u202f", " ").replace("\u00a0", " ").strip().lower()
    is_12h = "am" in clean or "pm" in clean
    is_pm = "pm" in clean
    is_am = "am" in clean

    numbers = re.sub(r"[ap]m", "", clean).strip()
    parts = numbers.split(":")

    if len(parts) < 2:
        return None

    try:
        hour = int(parts[0])
        minute = int(parts[1])
        second = int(parts[2]) if len(parts) > 2 else 0

        if is_12h:
            if is_pm and hour < 12:
                hour += 12
            if is_am and hour == 12:
                hour = 0

        if not (0 <= hour <= 23 and 0 <= minute <= 59):
            return None

        time24 = f"{hour:02d}:{minute:02d}:{second:02d}"
        return hour, minute, second, time24
    except (ValueError, IndexError):
        return None
