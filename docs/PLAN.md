# Web game plan

## Current direction

Start with a browser game optimized for iPhones. Artwork will be addressed later, potentially with newly generated illustrations. The first playable version uses Vite and plain JavaScript, a pure rules engine, and responsive CSS. Native apps and online multiplayer are future work.

## Implemented

- 36-card deck, deterministic shuffle, and three-player deal.
- Family request restrictions, permitted self-card bluffs, positive and negative replies.
- Separate thanking and transfer actions; repeated asks after successful transfers.
- Challengeable incorrect requests and premature touching; first-caller turn interruption and resumption.
- Full-family win detection and empty-hand skipping.
- Bots using only their own cards and public history, with occasional etiquette mistakes.
- Responsive table, hidden opponent hands, family tabs, full card names, tutorial, replay, conversation history, and localStorage progress.
- Mechanics tests including 100 seeded complete games; mobile browser interaction tests; static production build.

## Next milestones

1. Playtest on real iPhone Safari: scrolling, control placement, speed of bot turns, challenge reaction time, and clarity of turn resumption. Tune the mechanics based on feedback.
2. Improve the tutorial and bot strategy; add selectable difficulty and explicit timing feedback for challenges.
3. Add an asset manifest and original or approved artwork for all 36 faces and backs, preserving readable card names and accessibility labels.
4. Add PWA installation and offline asset caching if wanted.
5. Choose a static hosting target and deploy when requested. A local server is not a public deployment.
6. Add private-room online play only after offline mechanics stabilize; use a server to protect hidden hands and order simultaneous challenges.

## Validation limits

Browser automation uses Chromium with iPhone-sized viewport and touch emulation. Actual iPhone Safari behavior still needs device testing. No speech recognition, online multiplayer, native packaging, or store submission is included in the prototype.

## Playtesting improvements

Added Relaxed, Standard, and Sharp difficulty, affecting public-history memory, mistakes, turn speed, and challenge timing. A visible countdown explains the challenge reaction window. Opening the guide pauses it, while browsing families does not restart it. Card selections now update the displayed request immediately. Browser checks cover difficulty persistence, countdown behavior, and desktop layout in addition to mobile interaction. User will playtest in a web browser first.

## Direct browser testing route

A self-contained HTML build is available through `npm run playtest`. This lets the user download and open the game in a desktop browser without hosting, a development server, or dependency installation. The standalone browser check blocks HTTP/HTTPS requests and verifies interaction with the embedded HTML. Direct file-URL navigation is blocked by the cloud browser policy, so opening a downloaded file must be confirmed in the user’s browser. Public hosting remains a separate future step.
