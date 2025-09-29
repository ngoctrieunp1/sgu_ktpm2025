import React, { useContext, useEffect } from 'react';
import '../Cart/Cart.css';
import { Context } from '../../../Context/Context';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cartItems, setCartItems, view, userId, setview, removCart, getTotalPrice, handleIncrement, handleDecrement } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/cart/${userId}`);
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };
    fetchCartItems();
  }, [setCartItems, userId]);

  useEffect(() => {
    const fetchItems = async () => {
      const itemIds = cartItems.map(item => item.itemId);
      if (itemIds.length > 0) {
        try {
          const responses = await Promise.all(itemIds.map(itemId => axios.get(`http://localhost:4000/item/${itemId}`)));
          const items = responses.map(response => response.data);
          setview(items);
        } catch (error) {
          console.error('Error fetching item details:', error);
        }
      }
    };
    fetchItems();
  }, [cartItems, setview]);

  return (
    <div className='cart'>
      <div className="cart-item">
        <div className="cart-item-header">
          <p>Image</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />
        {cartItems.length === 0 ? (
          <p className='empty-cart'>Your cart is empty</p>
        ) : (
          cartItems.map((item) => {
            const product = view.find(product => product._id === item.itemId);
            if (product && item.quantity > 0) {
              return (
                <div key={item._id} className="cart-item-content">
                  <img src={product.image} alt={product.name} />
                  <p>{product.name}</p>
                  <p>${product.price}</p>
                  <div className='quantity-controls'>
                    <button onClick={() => handleDecrement(item.itemId)} className='decrementbtn'>-</button>
                    {item.quantity}
                    <button onClick={() => handleIncrement(item.itemId)} className='incrementbtn'>+</button>
                  </div>
                  <p>${product.price * item.quantity}</p>
                  <p onClick={() => handleDecrement(item.itemId)} className='remove-item'>x</p>
                </div>
              );
            }
            return null;
          })
        )}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            {/* <p>Subtotal</p>
            <p>${getTotalPrice()}</p> */}
          </div>
          <hr />
          <div className="cart-total-details">
            {/* <p>Delivery fee</p>
            <p>$2</p> */}
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Total</p>
            <p>${getTotalPrice() + 0}</p>
          </div>
          <button onClick={() => navigate("/placeorder")} className='checkout-btn'>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
