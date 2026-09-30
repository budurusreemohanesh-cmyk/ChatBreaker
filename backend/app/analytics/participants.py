from typing import List, Dict
from app.models.schemas import (
    NormalizedMessage,
    ParticipantStats,
    ConversationStarterStats,
    ReplyTimeStats,
    LongestMessageStats,
    EmojiStats,
    LinkStats,
    MediaStats,
)

PALETTE = [
    "#6366F1", "#EC4899", "#10B981", "#F59E0B", "#8B5CF6",
    "#06B6D4", "#F97316", "#14B8A6", "#E11D48", "#3B82F6"
]

def calculate_participants(
    messages: List[NormalizedMessage],
    starters: ConversationStarterStats,
    replies: ReplyTimeStats,
    longest: LongestMessageStats,
    emojis: EmojiStats,
    links: LinkStats,
    media: MediaStats
) -> List[ParticipantStats]:
    total_messages = len(messages)
    p_groups: Dict[str, List[NormalizedMessage]] = {}

    for m in messages:
        if m.sender not in p_groups:
            p_groups[m.sender] = []
        p_groups[m.sender].append(m)

    starter_map = {s.name: s for s in starters.starters}
    participants_list: List[ParticipantStats] = []

    for idx, (name, p_msgs) in enumerate(p_groups.items()):
        p_count = len(p_msgs)
        pct = round((p_count / total_messages) * 100.0, 1) if total_messages > 0 else 0.0
        words = sum(m.wordCount for m in p_msgs)
        chars = sum(m.characterCount for m in p_msgs)
        active_days = len(set(m.date for m in p_msgs))

        starter_info = starter_map.get(name)
        c_starts = starter_info.count if starter_info else 0
        c_starts_pct = starter_info.percentage if starter_info else 0.0

        p_reply = replies.byParticipant.get(name)
        median_reply = p_reply.medianMinutes if p_reply else None
        avg_reply = p_reply.avgMinutes if p_reply else None

        p_longest = longest.perParticipant.get(name)
        l_words = p_longest.wordCount if p_longest else 0
        l_chars = p_longest.characterCount if p_longest else 0
        l_text = p_longest.preview if p_longest else ""

        emoji_list = emojis.emojisPerParticipant.get(name, [])
        emoji_count = sum(e.count for e in emoji_list)

        links_count = links.linksPerParticipant.get(name, 0)
        media_count = media.mediaPerParticipant.get(name, 0)

        participants_list.append(
            ParticipantStats(
                name=name,
                messageCount=p_count,
                percentage=pct,
                wordCount=words,
                avgWordsPerMessage=round(words / p_count, 1) if p_count > 0 else 0.0,
                avgMessageLength=round(chars / p_count, 1) if p_count > 0 else 0.0,
                longestMessageWords=l_words,
                longestMessageChars=l_chars,
                longestMessageText=l_text,
                emojiCount=emoji_count,
                linksShared=links_count,
                mediaCount=media_count,
                activeDays=active_days,
                conversationStarts=c_starts,
                conversationStartsPct=c_starts_pct,
                medianReplyTimeMinutes=median_reply,
                avgReplyTimeMinutes=avg_reply,
                color=PALETTE[idx % len(PALETTE)]
            )
        )

    participants_list.sort(key=lambda x: x.messageCount, reverse=True)
    return participants_list
