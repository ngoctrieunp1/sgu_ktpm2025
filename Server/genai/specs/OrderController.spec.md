# GenAI Test Specification — OrderController.js

## Scope
Unit tests for `Controllers/OrderController.js` (order placement, status, and history).

## Tech / Framework Rules (MUST)
- Test runner: **Jest**
- Unit tests only (mock req/res)
- CommonJS `require`
- Do NOT start server
- All DB calls MUST be mocked
- Do NOT require a real MongoDB connection

## File Under Test
- Path: `../Controllers/OrderController.js`

## Export Style
```js
module.exports = {
  placeOrder,
  placeOrderSplit,
  updateOrderStatus,
  updateOrderStatusByRestaurant,
  getOrderById,
  getUserOrders,
  getRestaurantOrders,
  getPendingOrders,
  getDeliveredOrders,
  getPaymentPendingOrders,
  getConfirmedOrders,
  getPreparingOrders,
  getOutForDeliveryOrders,
  cancelOrder
}
```

Import:
```js
const orderController = require("../Controllers/OrderController");
```

## Dependencies to Mock (CRITICAL)
- `../Models/Order` (OrderCollection)
  - `create`, `find`, `findById`, `findByIdAndUpdate`, `updateOne`, etc. (as used)
- `../Models/products` (productsCollection)
  - `find` with chained calls: `.select().lean()`
- `mongoose`
  - You generally DO NOT need to deeply mock mongoose; but if code uses `mongoose.Types.ObjectId`,
    ensure tests don't crash by providing valid strings or mocking `Types.ObjectId`.

## Mocking chained calls (IMPORTANT)
For `productsCollection.find(...).select(...).lean()`:
- `find` should return an object with:
  - `select: jest.fn().mockReturnThis()`
  - `lean: jest.fn().mockResolvedValue([...])`

Example:
```js
productsCollection.find.mockReturnValue({
  select: jest.fn().mockReturnThis(),
  lean: jest.fn().mockResolvedValue([/* products */]),
});
```

## Express Mocking Contract
```js
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
```

## Assertion Rules (IMPORTANT)
- Prefer asserting:
  - status code
  - stable message strings
  - presence of `order` / `orders` in response
- Do NOT assert the entire order payload equality (too many fields)
- For list endpoints: assert `Array.isArray(result)` or `res.json` called with array

## Function Specs (Core)

### 1) `placeOrder(req, res)`
#### Inputs
- `req.body` typically includes: `userId`, `items` (array), address, phone, payment info, etc.

#### Behavior
- Reads products from DB by item IDs
- If a requested product is missing → returns **400** with error message
- Creates order → returns **201/200** with created order

#### Test Cases
1. **success**:
   - mock productsCollection.find().select().lean() returns products matching requested items
   - mock OrderCollection.create returns order doc
   - expect 201/200 and json called
2. **missing product**:
   - mock productsCollection returns missing item
   - expect 400 and error message
3. **unexpected error**:
   - force OrderCollection.create throw
   - expect 500/400 (per code)

### 2) `placeOrderSplit(req, res)`
- Similar to placeOrder, but splits by restaurant
- Same test structure:
  1) success
  2) missing product → 400
  3) error

### 3) `updateOrderStatus(req, res)`
#### Inputs
- `req.params.id` (order id)
- `req.body.status`
#### Behavior
- Updates order status
- not found → 404
- success → 200
#### Test Cases
1) updated → 200
2) not found → 404
3) error → 500

### 4) `cancelOrder(req, res)`
- Cancels order by id (and may check payment/status)
- Test Cases:
  1) cancel success → 200
  2) not found → 404
  3) error → 500

## Query/List Endpoints (should have at least 1 test each)
### `getUserOrders(req, res)`
- mock `OrderCollection.find` returns array → 200

### `getRestaurantOrders(req, res)`
- mock `OrderCollection.find` returns array → 200

### Status filters
- `getPendingOrders`, `getDeliveredOrders`, `getPaymentPendingOrders`, `getConfirmedOrders`, `getPreparingOrders`, `getOutForDeliveryOrders`
- For each: mock `OrderCollection.find` returns array → 200

## Special Notes (String Matching)
Some statuses are exact strings in code.
- When writing tests for delivered filter, match the exact delivered status string used in controller.
- Avoid asserting exact status string unless necessary; prefer asserting `find` was called with a filter containing `status`.
