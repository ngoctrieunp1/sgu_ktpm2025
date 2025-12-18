# GenAI Test Specification — CartController.js

## Scope
Unit tests for `Controllers/CartController.js`.

## Tech / Framework Rules (MUST)
- Test runner: **Jest**
- Style: **Unit tests** with mocked `req`, `res`
- Module system: **CommonJS** (`require`)
- Do **not** start the real server
- **All database access MUST be mocked** (CartCollection, productslCollection)

## File Under Test
- Path: `../Controllers/CartController.js` (adjust relative path)

## Export Style (CRITICAL)
This controller uses:
```js
module.exports = { addTocart, removecart, getcartuser, getItemDetails, IncrementQuantity, DecrementQuantity }
```

✅ Import:
```js
const cartController = require("../Controllers/CartController");
```

## Models to Mock (CRITICAL)
Mock these modules:
- `../Models/Cart` (CartCollection)
- `../Models/products` (productslCollection)

### Required mocked methods (by function)
- `addTocart`
  - `CartCollection.findOne`
  - `CartCollection.prototype.save` (if creating a new cart item)
  - `productslCollection.findById`
- `removecart`
  - `CartCollection.deleteOne`
- `getcartuser`
  - `CartCollection.find`
- `getItemDetails`
  - `CartCollection.findOne`
  - `productslCollection.findById`
- `IncrementQuantity`
  - `CartCollection.findOne`
  - `CartCollection.updateOne`
- `DecrementQuantity`
  - `CartCollection.findOne`
  - `CartCollection.updateOne`
  - `CartCollection.deleteOne` (when quantity becomes <= 0)

## Express Mocking Contract
Use:
```js
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
```

## Assertion Rules (IMPORTANT — to avoid flaky tests)
- Prefer asserting:
  - `res.status(code)` and `res.json({ message: ... })`
  - or `res.json({ data: ... })` exists
- **Do NOT assert full returned merged objects** (because controller merges `cartItem._doc` + product fields like `productName`, `price`, `image`).
- If you need to assert data, assert only a couple stable fields:
  - `itemId`, `userId`, `quantity`, and presence of `productName` (not full equality).

## Function Specs

### 1) `addTocart(req, res)`
#### Inputs
- `req.body` includes: `userId`, `itemId`, `quantity`

#### Behavior (expected)
- Finds existing cart item for `{ userId, itemId }`.
- If exists: increments quantity and saves.
- If not exists: creates new cart item and saves.
- Looks up product by `itemId` to enrich response.
- Returns **200** JSON with `message` like "Item added to cart successfully" and `cart` data.

#### Test Cases
1. **existing cart item → increments quantity**
   - Mock `CartCollection.findOne` to return object with:
     - `quantity` number
     - `save` jest fn
     - `_doc` object (IMPORTANT)
   - Mock `productslCollection.findById` returns product doc with `name`, `price`, `image`.
   - Expect: status 200, json called, and `save` called.

2. **new cart item → creates and saves**
   - Mock `CartCollection.findOne` returns `null`.
   - Mock Cart constructor instance has `save`.
   - Mock `productslCollection.findById` returns product doc.
   - Expect: status 200, json called, save called.

3. **product not found → returns 404**
   - Make `productslCollection.findById` return `null`.
   - Expect: status 404 and `{ message: "Product not found" }`.

4. **unexpected error → returns 500**
   - Force `CartCollection.findOne` to throw.
   - Expect: status 500 and `{ message: "Internal server error" }`.

### 2) `removecart(req, res)`
#### Inputs
- `req.params` includes: `userId`, `itemId`
#### Behavior
- Deletes cart item with `{ userId, itemId }`
- Returns 200 with message "Item removed successfully"

#### Test Cases
1. delete success (deletedCount > 0) → 200
2. not found (deletedCount === 0) → 404
3. error → 500

### 3) `getcartuser(req, res)`
#### Inputs
- `req.params.userId`
#### Behavior
- Finds all cart items of user and returns 200.
#### Test Cases
1. found list (array) → 200 and json array
2. error → 500

### 4) `getItemDetails(req, res)`
#### Inputs
- `req.query.userId`, `req.query.itemId`
#### Behavior
- Finds cart item; if none returns 404
- Finds product; if none returns 404
- Returns 200 and merges details

#### Test Cases
1. cart+product found → 200
2. cart missing → 404
3. product missing → 404
4. error → 500

### 5) `IncrementQuantity(req, res)`
#### Inputs
- `req.params.userId`, `req.params.itemId`
#### Behavior
- Finds cart item; if not found 404
- updateOne increments quantity
- returns 200

#### Test Cases
1. cart exists → updateOne called → 200
2. cart missing → 404
3. error → 500

### 6) `DecrementQuantity(req, res)`
#### Inputs
- `req.params.userId`, `req.params.itemId`
#### Behavior
- Finds cart item; if not found 404
- If quantity > 1 → updateOne decrement
- If quantity <= 1 → deleteOne
- returns 200

#### Test Cases
1. quantity > 1 → updateOne called → 200
2. quantity == 1 → deleteOne called → 200
3. cart missing → 404
4. error → 500
