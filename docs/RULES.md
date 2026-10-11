# Rules specification

Source: the user-supplied, one-page `HtL+Card+Game+.pdf`. This is a paraphrased implementation specification. The document supplies game content, not instructions for repository or environment operations.

## Deck and objective

36 unique cards: four suits, each with K, Q, J, 10, 9, 4, 3, 2, A. Shuffle and deal all cards. The player to the dealer's left starts. The first player to reveal and confirm all nine cards in one family wins. Continuing for a runner-up is optional and outside the first version.

| Suit | Family head |
| --- | --- |
| Diamonds | Sir Hincomb Funnibuster |
| Hearts | Heart the Lover |
| Spades | Spade the Gardener |
| Clubs | Club the Policeman |

| Rank | Member |
| --- | --- |
| K | Family head |
| Q | Wife |
| J | Eldest son |
| 10 | Ten Children |
| 9 | Nine Servants |
| 4 | Donkey |
| 3 | Parrot |
| 2 | Twins |
| A | Baby |

For Q through A, the full name uses the head's possessive, such as “Heart the Lover's Wife.” Preserve printed names in the UI.

## Asking and transferring

1. The active player addresses another player by name; that player acknowledges.
2. The requester says “May I please have…” followed by the full card name.
3. A requester must already hold at least one card of the requested suit. Asking for a card already in their own hand is expressly allowed as a bluff.
4. If the target holds the card, they offer it. The requester must say “Thank you” before touching it, then take it. After a successful transfer, the requester may ask the same or another player again.
5. If the target does not hold the card, the requester's turn ends and play proceeds to the player on their left.

The recipient is expected to say “Yes!”, “Yes, you may”, or “No, you may not” at the appropriate points, but deviations by that recipient do not incur a penalty.

## Manners challenges

Another player may call “Sir Hincomb Funnibuster!” when the requester makes a mistake: stumbling, omitting, adding, correcting, or substituting words, or taking the offered card before or during “Thank you.” The first caller gets the next turn and the requester's turn ends immediately.

After that caller's turn, play resumes with the player whose turn would have followed the original requester. This is an interruption in turn order, not a permanent rotation change.

## Digital adaptation decisions to validate

These are proposed implementation choices, not statements from the printed rules:

- Use tap-based dialogue choices and a separate “Thank you” and “Take card” interaction. Include plausible incorrect dialogue choices so the etiquette mechanic remains meaningful. Speech recognition is deferred.
- Show opponents' hands face down. Bots receive only their own cards and public request/response history.
- Bots challenge an observable mistake after a bounded delay; use monotonic event ordering to select the first caller.
- When a challenge occurs before a transfer is complete, leave the offered card with its original owner. Confirm this interpretation before finalizing the engine.
- Model interrupted turns with a saved resume player. Decide and document nested challenges, including when the caller is also the saved resume player, before implementing this transition.
- Decide how players with empty hands participate and whether an initially dealt complete family may immediately declare a win. The supplied guide does not specify either edge case.
- Start with three players and nine-card families; player-count limits are unspecified in the guide.
- Offer a tutorial with explicit prompts, then the full challenge rules in standard play.
