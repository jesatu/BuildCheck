# BuildCheck

Plan and validate Lorien Trust character builds.

Choose the skills you want. BuildCheck checks the build is legal, works out the OSPs needed, and shows the route to get there: prerequisites, one step per tree per year, 4 purchases per year, retirement double steps, special creature and special power cards, and alternative routes such as loresheets and the Architect.

**Status:** phase 4 (build editor). Early version: expect rough edges.

## Rules source

All rules come from [docs/LT-Build-Rules-Reference.md](docs/LT-Build-Rules-Reference.md), a summary of the Lorien Trust Rules Handbook v4.06 and the v4.06 loresheets. Rule IDs in the code (for example `OS-2` or `LIM-5`) refer to that document.

The full handbook and loresheet text are © Merlinroute Ltd and are not stored in this repository.

## Development

Requires Node.js 24 or later.

```bash
npm install
```

```bash
npm run dev
```

```bash
npm test
```

```bash
npm run build
```

Print the cheapest-vs-fastest divergence report:

```bash
npm run divergence
```

## Project layout

| Path | Contents |
|---|---|
| `src/data/` | Rules data: Character Skills, Occupational Skills, loresheets, spell lists, races, rule constants and switches |
| `src/data/data.test.ts` | Checks that the data is internally consistent |
| `src/engine/` | Build model, validator (`validate.ts`) and route planner (`plan.ts`) |
| `docs/` | Rules reference document |

### Editing the rules data

- Each Occupational Skill has a `learn` requirement (checked when buying, and defines its tree) and a `use` requirement (checked for the skill to be active).
- `replaces` lists skills that leave the card when this one is bought. Only record it where the handbook says "replaces".
- Loresheet skills record the loresheet's own tier, cost and prerequisites.
- Rule constants are in `src/data/rules.ts`. Rulings are recorded in the reference document.

Run `npm test` after any change to the data.

## Deployment

Every push to `main` runs the tests, builds the site and publishes it to GitHub Pages at <https://jesatu.github.io/BuildCheck/>.
