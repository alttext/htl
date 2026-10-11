# Heart the Lover

An iPhone-friendly browser game of families, memory, and impeccable manners, based on the rules supplied for the game in Lily King's *Heart the Lover*.

## Play and develop

Requires Node.js 22.12+ (validated with 24.19.0).

```sh
npm ci
npm run dev
```

Open the development server in your browser. On a phone on the same network, use your computer's LAN address and port 5173. This cloud onboarding interface does not provide a public game URL.

```sh
npm test                 # Rules tests, including 100 seeded complete games
npm run build            # Static production files in dist/
npm run preview          # Serve the production build locally
```

Browser tests run in an iPhone-sized Chromium context:

```sh
npx playwright install chromium
npm run test:browser
# Or use an installed Chromium:
CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser
```

In the cloud machine, add `--cache /workspace/.npm-cache` to npm installation commands when the default cache is unwritable.

## First playable version

- One human against Jos and Electa; all 36 cards are dealt.
- Ask only from families in your hand. Asking for your own card as a bluff is allowed.
- Say “Thank you” before taking an offered card, then ask again.
- A failed ask passes the turn to the left.
- Mistakes in wording or premature touching invite “Sir Hincomb Funnibuster!” The first caller gets a bonus turn.
- Bots use their own hand and public request history, and occasionally make challengeable mistakes.
- Family tabs, horizontally scrolling cards, large touch controls, tutorial, conversation history, and local saved progress.

Cards are original typographic placeholders; no author-site artwork is included. No account or backend is needed. The game requires an initial page load; offline installation/PWA support is not implemented.

See [rules and digital interpretations](docs/RULES.md) and [the current plan](docs/PLAN.md). The engine is separated from the UI in `src/game.js`. iPhone-sized browser tests have limited coverage and do not replace real iPhone Safari testing.

Each cloud task already has an isolated checkout. Use that checkout rather than creating a worktree unless explicitly requested.

## Playtesting settings

Use Relaxed for seven-second challenge windows and slower, more forgetful bots. Standard gives 4.2 seconds; Sharp gives 2.4 seconds and bots with full public-history memory. Difficulty saves on this browser. Changing it takes effect for future bot actions and challenge windows. The countdown for an active challenge cannot be reset by switching family tabs. Opening the guide pauses that countdown until you return.

## Download-and-open playtest

`npm run playtest` builds `dist/heart-the-lover-playtest.html`: the complete game in a single file with its JavaScript and CSS embedded. Download it and open it in a desktop browser without running a server. It does not need a network connection. Start with Relaxed difficulty. Local saved progress depends on your browser permitting storage for local files; moving or renaming the file may change its storage location. Mobile file viewers may show a preview instead of executing the game; use a desktop browser for this download-and-open route.
