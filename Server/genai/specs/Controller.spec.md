# GenAI Test Specification — Controller.js (Products)

## Scope
Unit tests for `Controllers/Controller.js` (product-related controller).

## Tech / Framework Rules (MUST)
- Test runner: **Jest**
- Unit test only (mock `req`, `res`)
- CommonJS `require`
- Do NOT start server
- All DB calls MUST be mocked

## File Under Test
- Path: `../Controllers/Controller.js`

## Export Style
This controller exports an object via:
```js
module.exports = { create, view, getproducts, update, remove, getproductsbyid, getRestaurantProducts, searchproduct }
```

Import:
```js
const productController = require("../Controllers/Controller");
```

## Models to Mock
- `../Models/products` (productslCollection)

### Methods to mock
- `create` / `update` / `remove` / `getproductsbyid`
  - `productslCollection.create`
  - `productslCollection.findById`
  - `productslCollection.findByIdAndUpdate`
  - `productslCollection.findByIdAndDelete`
- `view` / `searchproduct`
  - `productslCollection.aggregate`
- `getproducts` / `getRestaurantProducts`
  - `productslCollection.find` (and chained methods if used: `sort`, `limit`, etc.)

## Express Mocking Contract
```js
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
```

## Global Assertion Rules (IMPORTANT)
- Prefer asserting:
  - status code
  - presence of `message` or `data`
- Do NOT assert exact Mongo aggregation pipelines.
- For aggregate/search endpoints, assert:
  - `aggregate` called
  - response is 200 and json array/object.

## Function Specs

### 1) `create(req, res)`
#### Inputs
- `req.body`: product fields (name, price, description, etc.)
- `req.user`: MUST exist and should include both `id` and `_id` to avoid mismatch
  - Provide in tests: `req.user = { id: "u1", _id: "u1" }`

#### Behavior
- Creates a product; sets restaurant/postedBy fields using `req.user`
- Returns 201 on success
- Returns 400/500 on error (depending on implementation)

#### Test Cases
1. success → `productslCollection.create` returns doc → status 201
2. missing `req.user` or create throws → returns 500/400

### 2) `view(req, res)`
#### Inputs
- Typically no required params
#### Behavior
- Returns list of products using `aggregate(...)` with lookups.
- status 200 and json list

#### Test Cases
1. aggregate returns array → 200 and json(array)
2. aggregate throws → 500

### 3) `getproducts(req, res)`
#### Behavior
- Returns products list (often with filters/pagination)
#### Test Cases
1. find returns array → 200
2. error → 500

### 4) `update(req, res)`
#### Inputs
- `req.params.id` (product id)
- `req.body` update fields
#### Behavior
- updates product
- if not found → 404
- success → 200

#### Test Cases
1. found and updated → 200
2. not found → 404
3. error → 500

### 5) `remove(req, res)`
#### Inputs
- `req.params.id`
#### Behavior
- deletes product
- if not found → 404
- success → 200

#### Test Cases
1. delete ok → 200
2. not found → 404
3. error → 500

### 6) `getproductsbyid(req, res)`
#### Inputs
- `req.params.id`
#### Behavior
- findById and return 200, or 404
#### Test Cases
1. found → 200
2. not found → 404
3. error → 500

### 7) `getRestaurantProducts(req, res)`
#### Inputs
- restaurant id from `req.params` or `req.user` depending on code
#### Behavior
- returns restaurant products
#### Test Cases
1. find returns array → 200
2. error → 500

### 8) `searchproduct(req, res)`
#### Inputs
- usually `req.query.search` or keyword
#### Behavior
- uses `aggregate` or `find` to filter
#### Test Cases
1. returns list → 200
2. error → 500
