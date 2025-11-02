import React, { useContext, useState, useEffect } from 'react';
import '../PlaceOrder/placeOrder.css';
import { Context } from '../../../Context/Context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function PlaceOrder() {
  const { getTotalPrice, cartItems, userId, token, setCartItems } = useContext(Context);
  const navigate = useNavigate();

  const [formData, setformData] = useState({
    name: '',
    phoneNumber: '',
    street: '',
    city: '',
    pincode: ''
  });

  useEffect(() => {
    if (!token || getTotalPrice() === 0) navigate('/cart');
  }, [token, getTotalPrice, navigate]);

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

const handlePayment = async (e) => {
  e.preventDefault();
  try {
    const orderDetails = {
      userId,
      address: {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        street: formData.street,
        city: formData.city,
        pincode: formData.pincode,
      },
      products: cartItems
        .filter(i => Number(i.quantity) > 0)
        .map(i => ({
          productId: i.itemId || i.productId || i._id, 
          quantity: Number(i.quantity),
        })),
    };

    // Gọi API backend
    const resp = await axios.post("http://localhost:4000/placeorder-split", orderDetails);

    // Nếu backend trả {orders: [...]}
    const orders = resp.data?.orders || resp.data; // fallback nếu BE trả mảng
    const count = Array.isArray(orders) ? orders.length : 1;

    toast.success(`Tạo ${count} đơn hàng thành công!`);

    // Xóa giỏ hàng
    await axios.delete(`http://localhost:4000/cart/clear/${userId}`);
    setCartItems([]);

    // Chuyển sang trang My Orders
    navigate("/myorder");
  } catch (error) {
    console.error("Error placing order:", error);
    const msg =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "Failed to place order";
    toast.error(String(msg));
  }
};


  return (
    <form className='place-order' onSubmit={handlePayment}>
      <div className="place-order-left">
        <h2>Shipping Address</h2>
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
        <input type="text" name="street" placeholder="Street Address" value={formData.street} onChange={handleChange} required />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
        <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2><br />
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>{getTotalPrice()}</p>
          </div>
          <hr />
          {/* BỎ Delivery Fee */}
          <div className="cart-total-details">
            <p>Total</p>
            <p>{getTotalPrice()}</p>
          </div>
          <button style={{ marginTop: "30px" }} type="submit">PROCEED TO ORDER</button>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;
