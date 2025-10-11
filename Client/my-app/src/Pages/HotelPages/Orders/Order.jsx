
import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Context } from '../../../Context/Context';
import parcels from '../../../Assets/admin_assets/parcel_icon.png';
import './Order.css';

function Order() {
  const [orders, setOrders] = useState([]);
  const { userId: ctxUserId, User } = useContext(Context);

  // Lấy token + restaurantId từ localStorage nếu Context chưa có
  const token = useMemo(() => localStorage.getItem('token') || '', []);
  const restaurantId = useMemo(() => {
    // Ưu tiên lấy từ Context, fallback localStorage
    return ctxUserId || localStorage.getItem('userId') || '';
  }, [ctxUserId]);

  useEffect(() => {
    if (!token || !restaurantId) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/restaurant/${restaurantId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [restaurantId, token]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.patch(
        `http://localhost:4000/updateorder/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(prev =>
        prev.map(o => (o._id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  if (!token || !restaurantId) {
    return (
      <div className="order-container">
        <p style={{ padding: 16 }}>
          Vui lòng <b>đăng nhập bằng tài khoản Restaurant</b> để xem đơn hàng.
        </p>
      </div>
    );
  }

  return (
    <div className="order-container">
      {orders.length === 0 ? (
        <p style={{ padding: 16 }}>Chưa có đơn nào.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <img src={parcels} alt="Parcel Icon" className="parcel-icon" />
              <h2>Order ID: {order._id}</h2>
            </div>

            <div className="order-details">
              <ul className="order-products">
                {(order.products || []).map((product, idx) => {
                  const pname =
                    product.name ||
                    product.productId?.name ||
                    'Unnamed product';
                  return (
                    <li
                      key={
                        product.productId?._id ||
                        product.productId ||
                        product._id ||
                        idx
                      }
                      className="product-item"
                    >
                      {pname} x {product.quantity}
                    </li>
                  );
                })}
              </ul>
              <p className="order-total">
                <strong>Total Price:</strong> ${order.totalAmount}
              </p>
            </div>

            <div className="order-address">
              {order.address ? (
                <>
                  <p>
                    <strong>Name:</strong> {order.address.name}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.address.street},{' '}
                    {order.address.city}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.address.phoneNumber}
                  </p>
                  <p>
                    <strong>Pincode:</strong> {order.address.pincode}
                  </p>
                </>
              ) : (
                <p>Shipping address not available.</p>
              )}
            </div>

            <div className="order-status">
              <p>
                <strong>Status:</strong>{' '}
                <span className={`status-${String(order.status).toLowerCase()}`}>
                  {order.status}
                </span>
              </p>
              {order.status !== 'Cancelled' && (
                <>
                  <button
                    onClick={() => handleStatusChange(order._id, 'Order Ready')}
                    className="status-button"
                  >
                    Mark as Ready
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(order._id, 'Order Delivered')
                    }
                    className="status-button"
                  >
                    Mark as Delivered
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Order;
