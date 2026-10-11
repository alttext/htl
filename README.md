# Heart the Lover — mobile game

A planned mobile adaptation of the family-collecting card game described in Lily King's *Heart the Lover* and the supplied card-game guide.

Status: planning. No app has been implemented yet.

## Direction

- iOS and Android with Expo, React Native, and TypeScript.
- First playable version: one human and two bots, entirely offline.
- Preserve the distinctive etiquette, card names, and challenge mechanic.
- Add online private rooms after the core rules and mobile interaction are proven.

See [the implementation plan](docs/PLAN.md) and [the rules specification](docs/RULES.md).

## Artwork

The intended artwork source is https://lilykingbooks.com/htl-card-game.
The supplied guide credits Sarah Steedman for the paintings and Sarah Hiers for graphic design. We have not verified a license to distribute those images in an app. Use clearly marked development placeholders until usable assets and permission are available; retain source and attribution metadata when importing approved artwork.

## Development environment

Node.js 24.19.0 and npm 11.9.0 are available in the onboarding machine. There are currently no dependency manifests, installation steps, app services, or tests. Pin an Expo-supported Node version when scaffolding the app, commit its lockfile, and use frozen installation (`npm ci`) afterward. Each cloud task already has an isolated checkout; use it rather than creating a worktree unless explicitly requested.
