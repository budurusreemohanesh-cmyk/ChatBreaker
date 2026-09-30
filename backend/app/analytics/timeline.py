import re
from datetime import datetime
from urllib.parse import urlparse
from collections import Counter
from typing import List, Tuple
from app.models.schemas import (
    NormalizedMessage,
    TimelineStats,
    MonthlyVolumeItem,
    LongestMessageStats,
    LongestMessageItem,
    LinkStats,
    DomainItem,
    MediaStats,
)

URL_REGEX = re.compile(r"https?://\S+")

def calculate_timeline_and_artifacts(
    messages: List[NormalizedMessage]
) -> Tuple[TimelineStats, LongestMessageStats, LinkStats, MediaStats]:
    first_msg = messages[0]
    last_msg = messages[-1]

    monthly_counter: Counter = Counter()
    by_words: List[LongestMessageItem] = []
    by_chars: List[LongestMessageItem] = []
    per_participant: dict[str, LongestMessageItem] = {}

    domain_counter: Counter = Counter()
    links_per_p: Counter = Counter()
    total_links = 0

    media_per_p: Counter = Counter()
    total_media = 0

    for m in messages:
        # Monthly volume
        month_key = m.date[:7]
        monthly_counter[month_key] += 1

        # Longest messages
        preview = (m.message[:137] + "...") if len(m.message) > 140 else m.message
        item = LongestMessageItem(
            sender=m.sender,
            date=m.date,
            timestamp=m.timestamp,
            wordCount=m.wordCount,
            characterCount=m.characterCount,
            preview=preview,
            fullText=m.message
        )
        by_words.append(item)
        by_chars.append(item)

        if m.sender not in per_participant or m.wordCount > per_participant[m.sender].wordCount:
            per_participant[m.sender] = item

        # Media
        if m.isMedia:
            total_media += 1
            media_per_p[m.sender] += 1

        # Links
        urls = URL_REGEX.findall(m.message)
        if urls:
            total_links += len(urls)
            links_per_p[m.sender] += len(urls)
            for u in urls:
                try:
                    parsed = urlparse(u)
                    domain = parsed.netloc.replace("www.", "")
                    if domain:
                        domain_counter[domain] += 1
                except Exception:
                    pass

    by_words.sort(key=lambda x: x.wordCount, reverse=True)
    by_chars.sort(key=lambda x: x.characterCount, reverse=True)

    sorted_months = sorted(monthly_counter.items(), key=lambda x: x[0])
    monthly_volume = [
        MonthlyVolumeItem(
            month=m,
            count=c,
            label=datetime.strptime(m, "%Y-%m").strftime("%b %y")
        )
        for m, c in sorted_months
    ]

    timeline = TimelineStats(
        firstMessage=first_msg,
        lastMessage=last_msg,
        monthlyVolume=monthly_volume
    )

    longest = LongestMessageStats(
        byWords=by_words[:10],
        byChars=by_chars[:10],
        perParticipant=per_participant
    )

    top_domains = [
        DomainItem(domain=d, count=c)
        for d, c in domain_counter.most_common(10)
    ]

    links = LinkStats(
        totalLinks=total_links,
        linksPerParticipant=dict(links_per_p),
        topDomains=top_domains
    )

    media = MediaStats(
        totalMedia=total_media,
        mediaPerParticipant=dict(media_per_p)
    )

    return timeline, longest, links, media
