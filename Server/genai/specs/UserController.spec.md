# GenAI Test Specification — UserController.js

## Scope
Unit tests for `Controllers/UserController.js` (auth + user management).

## Tech / Framework Rules (MUST)
- Test runner: **Jest**
- Unit tests only (mock req/res)
- CommonJS `require`
- Do NOT start server
- All DB calls MUST be mocked
- Crypto/JWT functions MUST be mocked

## File Under Test
- Path: `../Controllers/UserController.js`

## Export Style
```js
module.exports = { register, login, getallusers, getuserbyid, updateuser, deleteuser, blockuser, unblockuser }
```

Import:
```js
const userController = require("../Controllers/UserController");
```

## Dependencies to Mock (CRITICAL)
- `../Models/User` (UserCollection)
  - `findOne`, `create`, `find`, `findById`, `findByIdAndUpdate`, `findByIdAndDelete`, `updateOne`
- `../Models/Order` (OrderCollection)
  - `find`
- `bcrypt`
  - `hash`, `compare`
- `jsonwebtoken`
  - `sign`
- Environment:
  - Set `process.env.JWT_KEY = "test_secret"`

## Express Mocking Contract
```js
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn(),
};
```

## Assertion Rules (IMPORTANT)
- Focus on:
  - status code
  - message strings
  - token existence
- Do NOT assert full user object (it may include extra fields)

## Function Specs

### 1) `register(req, res)`
#### Inputs
- `req.body`: `name`, `email`, `password`, plus other fields if any

#### Behavior
- Validates missing fields (if implemented)
- Checks existing user by email
- Hashes password (`bcrypt.hash`)
- Creates user (`UserCollection.create`)
- Creates JWT token (`jwt.sign`) using `process.env.JWT_KEY`
- Returns 201/200 with token and created user

#### Test Cases
1. **email exists** → 400 with message
2. **success** → mocks:
   - `findOne` returns null
   - `bcrypt.hash` returns "hashed"
   - `create` returns user doc
   - `jwt.sign` returns "token"
   - Expect 201/200 and token present
3. **unexpected error** → 500

### 2) `login(req, res)`
#### Inputs
- `req.body.email`, `req.body.password`

#### Behavior / Branches
1. Missing email or password → **400**
2. User not found → **400**
3. User is blocked → **403**
4. Password mismatch (`bcrypt.compare` false) → **400**
5. Success → **200** with token + user

#### Test Cases (MUST include these 5)
- Provide stable expected messages as in code.
- On success:
  - mock `bcrypt.compare` true
  - mock `jwt.sign` returns token
  - assert status 200 and returned token exists

### 3) `getallusers(req, res)`
- `UserCollection.find` returns array → 200
- error → 500

### 4) `getuserbyid(req, res)`
- `UserCollection.findById` returns doc → 200
- null → 404
- error → 500

### 5) `updateuser(req, res)`
- `findByIdAndUpdate` returns updated doc → 200
- null → 404
- error → 500

### 6) `deleteuser(req, res)`
- `findByIdAndDelete` returns doc → 200
- null → 404
- error → 500

### 7) `blockuser(req, res)`
#### Inputs
- `req.params.id` (user id)

#### Behavior
- Reads orders of user (`OrderCollection.find({ userId: id })`)
- If user has pending/non-delivered orders → should NOT block (status/message per code)
- If user has no pending orders → block via `UserCollection.updateOne({ _id:id }, { blocked:true })`

#### Test Cases
1. orders empty → updateOne called → 200
2. has at least 1 pending/non-delivered → updateOne NOT called → 400/403 (per code) with message
3. error → 500

### 8) `unblockuser(req, res)`
- `UserCollection.updateOne` sets `blocked:false`
- success → 200
- error → 500
