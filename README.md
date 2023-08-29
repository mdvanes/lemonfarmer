# 🍋 Lemon 👨‍🌾 Farmer

Use the [spacetraders.io](https://spacetraders.io/) API with [fp-ts](https://gcanti.github.io/fp-ts/).

### Usage

Make sure to install Deno: https://deno.land/manual/getting_started/installation

Then start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.

Run tests:

```bash
# Run mock server (note that dpx can also be installed globally)
# Does not work yet: deno run --allow-read --allow-run https://deno.land/x/dpx/cli.ts serve ./mocks
npx serve ./mocks
# Watch tests
deno test -A --watch fp_test.ts
```

Or run all tests:

```
deno test
```

Create mocks:

```bash
curl -H "Authorization: Bearer ey...w" https://api.spacetraders.io/v2/systems/X1-QB20/waypoints
```
