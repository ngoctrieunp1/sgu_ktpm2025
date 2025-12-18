# GenAI Test Specification — health.controller.js

## Scope
Unit tests for `Controllers/health.controller.js`.

## Tech / Framework Rules (MUST)
- Test runner: **Jest**
- Style: **Unit test** (mock `req`, `res`)
- Module system: **CommonJS** (`require`), NOT ESM imports.
- Do **not** start the real server.
- Do **not** access database/network.

## File Under Test
- Path: `../Controllers/health.controller.js` (adjust relative path from your test folder)

## Export Style (CRITICAL)
This controller uses **named exports** via `exports.<name>`.

✅ Correct import patterns:
```js
const healthController = require("../Controllers/health.controller");
healthController.health(req, res);
```

or

```js
const { health } = require("../Controllers/health.controller");
health(req, res);
```

🚫 Wrong (will fail):
- `const health = require(...); health(req,res)` if the module exports an object.
- `import ... from ...` (ESM).

## Function: `health(req, res)`
### Behavior
- Responds with HTTP **200**
- Responds JSON body:
```json
{ "status": "ok" }
```

### Positive Test Cases
1. **should return 200 and {status:"ok"}**
   - Given: any `req` object (can be `{}`).
   - When: call `health(req, res)`.
   - Then:
     - `res.status` called with `200`
     - `res.json` called with `{ status: "ok" }`

### Negative / Edge Test Cases
- Not required (function has no branches).

## Mocking Contract
Use a standard Express `res` mock:
```js
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
```

## Assertion Rules
- Must assert only:
  - status code (200)
  - json payload ({status:"ok"})
- Do not assert headers, timing, etc.
