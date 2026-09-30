import re
from collections import Counter
from typing import List, Dict, Tuple
from app.models.schemas import (
    NormalizedMessage,
    WordStats,
    WordFrequencyItem,
    PhraseStats,
    PhraseItem,
)

STOPWORDS = {
    'the', 'and', 'to', 'a', 'in', 'is', 'it', 'you', 'that', 'he', 'was', 'for', 'on', 'are',
    'as', 'with', 'his', 'they', 'i', 'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had',
    'by', 'word', 'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said',
    'there', 'use', 'an', 'each', 'which', 'she', 'do', 'how', 'their', 'if', 'will', 'up',
    'other', 'about', 'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her', 'would',
    'make', 'like', 'him', 'into', 'time', 'has', 'look', 'two', 'more', 'write', 'go', 'see',
    'no', 'way', 'could', 'my', 'than', 'first', 'been', 'call', 'who', 'its', 'now', 'find',
    'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part', 'just', 'ok', 'okay',
    'yeah', 'yes', 'omitted', 'media', 'pm', 'am', 'http', 'https', 'me', 'too', 'also', 'im',
    'dont', 'cant', 'didnt', 'wont', 'gonna', 'got', 'think', 'know', 'want', 'good', 'well',
    'really', 'much', 'even', 'back', 'here', 'ill', 'ive', 'youre', 'thats', 'going',
}

URL_REGEX = re.compile(r"https?://\S+")
WORD_REGEX = re.compile(r"\b[a-zA-Z]{2,}\b")

def calculate_words_and_phrases(
    messages: List[NormalizedMessage]
) -> Tuple[WordStats, PhraseStats]:
    word_counter: Counter = Counter()
    words_per_participant: Dict[str, Counter] = {}
    phrase2_counter: Counter = Counter()
    phrase3_counter: Counter = Counter()
    phrase4_counter: Counter = Counter()

    for m in messages:
        sender = m.sender
        if sender not in words_per_participant:
            words_per_participant[sender] = Counter()

        clean_text = URL_REGEX.sub("", m.message).lower()
        tokens = [w.strip("'") for w in WORD_REGEX.findall(clean_text)]
        filtered = [w for w in tokens if w not in STOPWORDS]

        for w in filtered:
            word_counter[w] += 1
            words_per_participant[sender][w] += 1

        # N-grams from filtered tokens
        for i in range(len(filtered) - 1):
            phrase2_counter[f"{filtered[i]} {filtered[i+1]}"] += 1
            if i < len(filtered) - 2:
                phrase3_counter[f"{filtered[i]} {filtered[i+1]} {filtered[i+2]}"] += 1
            if i < len(filtered) - 3:
                phrase4_counter[f"{filtered[i]} {filtered[i+1]} {filtered[i+2]} {filtered[i+3]}"] += 1

    top_words = [
        WordFrequencyItem(word=w, count=c)
        for w, c in word_counter.most_common(30)
    ]

    p_words = {
        sender: [
            WordFrequencyItem(word=w, count=c)
            for w, c in cnt.most_common(20)
        ]
        for sender, cnt in words_per_participant.items()
    }

    word_stats = WordStats(
        topWords=top_words,
        totalUniqueWords=len(word_counter),
        wordsPerParticipant=p_words
    )

    phrase_stats = PhraseStats(
        twoWordPhrases=[
            PhraseItem(phrase=p, count=c)
            for p, c in phrase2_counter.most_common(15) if c > 1
        ],
        threeWordPhrases=[
            PhraseItem(phrase=p, count=c)
            for p, c in phrase3_counter.most_common(15) if c > 1
        ],
        fourWordPhrases=[
            PhraseItem(phrase=p, count=c)
            for p, c in phrase4_counter.most_common(10) if c > 1
        ]
    )

    return word_stats, phrase_stats
