# Mobile game implementation plan

## Product goal

Make the printed game playable on a phone while retaining family collection, bluffing, memory, and the etiquette challenge. The first release candidate is an offline game against two bots on iOS and Android. No accounts, backend, or paid services are needed for that version.

## Stack and structure

Use Expo, React Native, and TypeScript, with a pure TypeScript rules engine separate from rendering. Pin compatible tool versions during scaffolding. Use Vitest for engine tests and a suitable React Native component-test setup after checking compatibility with the selected Expo SDK.

Proposed structure:

- `src/game/`: deck definitions, deterministic shuffling, state transitions, challenge handling, win detection, and bots.
- `src/screens/`: home, tutorial, game table, and results.
- `src/components/`: cards, hand, opponents, dialogue, offered-card interaction, and challenge button.
- `assets/cards/`: only assets approved for app distribution.

Keep authoritative game state in the engine. Represent UI actions as explicit events and validate each transition. Inject seeded randomness and a clock for reproducible tests. Do not let bots inspect hidden opponent hands.

## Milestones and acceptance criteria

### 1. Rules and asset preparation

Confirm the open interpretations in `RULES.md`. Inventory all 36 card faces and any card backs from the author's site when access is available. Record source, creator, permission, and permitted distribution for each asset. The supplied PDF is a rules guide, not a complete set of card-face artwork.

Deliverable: agreed rules specification and an asset manifest. Placeholder cards unblock development while artwork approval is pending.

### 2. App foundation and environment

Scaffold Expo with TypeScript in this repository, add a lockfile, pin the supported Node version, and establish lint/type-check/test commands. Prepare reusable installation and startup configuration after actually executing those steps.

Acceptance: frozen dependency installation succeeds; the app starts; a representative screen renders through the available runtime. Cloud web smoke tests can supplement development, but native behavior must also be checked on iOS and Android devices or supported simulators. Native signing and store submissions are later release steps.

### 3. Rules engine

Implement the deck, dealing, request legality, success and failure, separate thanks/transfer actions, etiquette violations, interruption/resumption, and complete-family declaration.

Acceptance: tests cover all 36 unique cards, conservation of cards, legal and illegal requests, permitted self-card bluffs, failed asks, repeated successful asks, premature touching, first challenge wins, interrupted-turn resumption, and the agreed edge cases. Seeded complete games terminate with a valid winner; unresolved edge cases must be resolved before declaring engine completion.

### 4. Offline playable game

Build the home screen, guided tutorial, portrait game table, scrollable hand, opponent/card selection, scripted dialogue choices, thank/take interaction, challenge control, victory reveal, and replay.

Bots use public history and their own hands to make legal requests; difficulty may vary memory and challenge reaction time.

Acceptance: a human can complete a full game against two bots without a network connection. Opponent cards remain hidden. Touch targets, readable text, suit labels, screen-reader descriptions, and reduced-motion behavior work on a small phone.

### 5. Artwork and mobile polish

Import approved assets, preserve aspect ratios, optimize image sizes, preload required cards, and provide accessible text equivalents. Add optional sound/haptics with independent mute controls. Persist an in-progress local game and validate restoration after app restart.

Acceptance: approved cards display correctly on both platforms, offline startup works, and saved-game restoration preserves turn and ownership state.

### 6. Optional online play

After offline validation, add private invite rooms with an authoritative server, private hand delivery, reconnect support, and server-ordered challenge events. Choose hosting and authentication only when this milestone is authorized. A backend introduces credentials and network requirements that the offline version does not have.

## Release checks

Required before a public mobile release: engine tests, type check, successful platform builds, real-device gameplay and accessibility checks, asset-distribution permission, appropriate attribution, and review of the app's name and presentation with the relevant rights holders. Store accounts, signing credentials, and final release copy are not needed to write the prototype.

## Current evidence

- Existing GitHub repository: `alttext/htl`; no initial commits or advertised branches at inspection.
- The rules PDF has been visually read. It credits Sarah Steedman for paintings and Sarah Hiers for graphic design.
- The author-site request returned HTTP 403 in this environment; artwork contents and licensing have not been verified.
- Node.js and npm are installed. No app dependencies or runtime have been set up yet because this milestone is planning.

Next implementation task: settle the engine edge cases, scaffold the offline Expo app, then execute and save reproducible setup and startup instructions.
