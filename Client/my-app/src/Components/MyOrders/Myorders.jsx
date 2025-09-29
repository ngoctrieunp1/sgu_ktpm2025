import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../Context/Context';
import parcel from '../../Assets/admin_assets/parcel_icon.png';
import jsPDF from 'jspdf';
import './myorder.css';
import toast from 'react-hot-toast';

function Myorders() {
  const { userId } = useContext(Context);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/getOrdersByUser/${userId}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };
    fetchOrders();
  }, [userId]);

  const downloadInvoice = (order) => {
    const doc = new jsPDF();
    doc.text('Invoice', 105, 10, null, null, 'center');
    doc.text(`Order ID: ${order._id}`, 10, 20);
    if (order.createdAt) {
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 10, 30);
    }
    doc.text('Products:', 10, 40);
    order.products.forEach((product, index) => {
      const productDetails = `${product.name} (x${product.quantity}) - $${product.price}`;
      doc.text(productDetails, 10, 50 + index * 10);
    });
    doc.text(`Total Amount: $${order.totalAmount}`, 10, 70 + order.products.length * 10);
    if (order.address) {
      doc.text('Shipping Address:', 10, 80 + order.products.length * 10);
      doc.text(`${order.address.name}, ${order.address.street}, ${order.address.city}`, 10, 90 + order.products.length * 10);
      doc.text(`Phone: ${order.address.phoneNumber}, Pincode: ${order.address.pincode}`, 10, 100 + order.products.length * 10);
    }
    doc.text(`Order Status: ${order.status}`, 10, 120 + order.products.length * 10);
    doc.save(`invoice_${order._id}.pdf`);
  };

  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
    
    if (!confirmCancel) {
      return; // Exit the function if the user clicks "Cancel"
    }
  
    try {
      const res = await axios.put(`http://localhost:4000/cancelOrder/${orderId}`);
      if (res.data.success) {
        setOrders(orders.map(order => order._id === orderId ? { ...order, status: 'Cancelled' } : order));
        toast.success('Order canceled successfully!')
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
    }
  };
  

  return (
    <div className='my-orders-container'>
      {orders.length > 0 ? (
        orders.slice().reverse().map(order => (
          <div key={order._id} className='order-card'>
            <div className="order-header">
              <img src={parcel} alt="Parcel Icon" className='order-icon' />
              <h2>Order #{order._id}</h2>
            </div>
            <div className='order-details'>
              <ul className='order-products'>
                {order.products && order.products.length > 0 ? (
                  order.products.map(product => (
                    <li key={product.productId || 'unknown'}>
                      {product.name} x {product.quantity}
                    </li>
                  ))
                ) : (
                  <li>No products found for this order.</li>
                )}
              </ul>
              <p className='total-price'><strong>Total Price:</strong> ${order.totalAmount}</p>
              {order.address ? (
                <div className='order-address'>
                  <p>{order.address.name}, {order.address.street}, {order.address.city}</p>
                  <p>{order.address.phoneNumber}, {order.address.pincode}</p>
                </div>
              ) : (
                <p>Shipping address not available.</p>
              )}
              <p className='order-status'><strong>Status:</strong> {order.status}</p>
              <button className='track-order-btn' onClick={() => downloadInvoice(order)}>
                Download Invoice
              </button>
              {order.status !== 'Cancelled' && (
                <button className='cancel-order-btn' onClick={() => cancelOrder(order._id)}>
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No orders</p>
      )}
    </div>
  );
}

export default Myorders;
