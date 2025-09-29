const CartCollection = require("../models/CartModels");
const productslCollection = require("../models/productModels");

// Add item to the cart
const addTocart = async (req, res) => {
  const { itemId, userId, quantity } = req.body;
  try {
    let cartItem = await CartCollection.findOne({ itemId, userId });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new CartCollection({ itemId, userId, quantity });
      await cartItem.save();
    }

    const product = await productslCollection.findById(itemId);
    const response = { ...cartItem._doc, productName: product.name, price: product.price, image: product.image };

    res.status(200).send(response);
  } catch (error) {
    res.status(400).send(error);
  }
};


// Remove item or decrease quantity
const removecart = async (req, res) => {
  const { itemId } = req.params;
  const { userId } = req.body;

  try {
    const cartItem = await CartCollection.findOne({ itemId, userId });
    if (cartItem) {
      await CartCollection.deleteOne({ _id: cartItem._id });
      res.status(200).send({ message: 'Item removed from cart' });
    } else {
      res.status(404).send({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};


// Get all cart items for a user
const getcartuser = async (req, res) => {
  const { userId } = req.params;
  try {
    const cartItems = await CartCollection.find({ userId });
    console.log('Cart Items:', cartItems); // Log cart items
    res.status(200).send(cartItems);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get item details by ID
const getItemDetails = async (req, res) => {
  const { itemId } = req.params;
  try {
    const item = await productslCollection.findById(itemId);
    console.log('Item Details:', item); // Log item details
    res.status(200).send(item);
  } catch (error) {
    res.status(400).send(error);
  }
};

// increment cart item quantity
const IncrementQuantity = async (req, res) => {
  const itemId = req.params.itemId;
  const { userId, quantity } = req.body;

  try {
    // Find the cart item for the user based on userId and itemId
    const cartItem = await CartCollection.findOne({ userId, itemId });
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Update the quantity
    cartItem.quantity = quantity;

    // Save the updated cart item
    await cartItem.save();

    return res.status(200).json({ message: 'Cart updated successfully', cartItem });
  } catch (error) {
    console.error('Error updating cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Decrementcart item quantity
const DecrementQuantity = async (req, res) => {
  const itemId = req.params.itemId;
  const { userId, quantity } = req.body;

  try {
    const cartItem = await CartCollection.findOne({ userId, itemId });
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Decrement the quantity
    cartItem.quantity = quantity;

    if (cartItem.quantity <= 0) {
      // Remove the item if the quantity is 0 or less
      await CartCollection.deleteOne({ _id: cartItem._id });
      return res.status(200).json({ message: 'Item removed from cart', cartItem });
    } else {
      await cartItem.save();
      return res.status(200).json({ message: 'Cart updated successfully', cartItem });
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addTocart,
  removecart,
  getcartuser,
  getItemDetails,
  IncrementQuantity,
  DecrementQuantity
  
};

