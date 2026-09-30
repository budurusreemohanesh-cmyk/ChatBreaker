from collections import Counter
from typing import List, Dict
import emoji
from app.models.schemas import (
    NormalizedMessage,
    EmojiStats,
    EmojiFrequencyItem,
    EmojiComboItem,
)

def calculate_emojis(messages: List[NormalizedMessage]) -> EmojiStats:
    emoji_counter: Counter = Counter()
    emojis_per_participant: Dict[str, Counter] = {}
    combos_counter: Counter = Counter()

    for m in messages:
        sender = m.sender
        if sender not in emojis_per_participant:
            emojis_per_participant[sender] = Counter()

        emoji_matches = [e["emoji"] for e in emoji.emoji_list(m.message)]
        for i, emo in enumerate(emoji_matches):
            emoji_counter[emo] += 1
            emojis_per_participant[sender][emo] += 1

            if i < len(emoji_matches) - 1:
                combo = f"{emo} {emoji_matches[i+1]}"
                combos_counter[combo] += 1

    top_emojis = [
        EmojiFrequencyItem(emoji=e, count=c)
        for e, c in emoji_counter.most_common(25)
    ]

    p_emojis = {
        sender: [
            EmojiFrequencyItem(emoji=e, count=c)
            for e, c in cnt.most_common(15)
        ]
        for sender, cnt in emojis_per_participant.items()
    }

    combinations = [
        EmojiComboItem(combo=combo, count=c)
        for combo, c in combos_counter.most_common(15) if c > 1
    ]

    return EmojiStats(
        topEmojis=top_emojis,
        totalEmojis=sum(emoji_counter.values()),
        emojisPerParticipant=p_emojis,
        emojiCombinations=combinations
    )
