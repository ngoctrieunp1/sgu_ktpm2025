import React, { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import { Context } from '../../../Context/Context';
import parcels from '../../../Assets/admin_assets/parcel_icon.png';
import './Order.css';

const API_URL = 'http://localhost:4000';

// Restaurant được phép chuyển:
// - Payment completed -> Order is being prepared
// - Order is being prepared -> Your order is on its way to you
const NEXT_BY_RESTAURANT = {
  'Payment pending': [], // Chờ admin, không thao tác
  'Payment completed': ['Order is being prepared'],
  'Order is being prepared': ['Your order is on its way to you'],
  'Your order is on its way to you': [], // Bước này do ADMIN đổi sang Delivered
  'Your order has been delivered successfully': [],
  'Cancelled': [],
};

function Order() {
  const [orders, setOrders] = useState([]);
  const { userId: ctxUserId } = useContext(Context);

  const token = useMemo(() => localStorage.getItem('token') || '', []);
  const restaurantId = useMemo(
    () => ctxUserId || localStorage.getItem('userId') || '',
    [ctxUserId]
  );
  const headers = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  const loadOrders = useCallback(async () => {
    if (!token || !restaurantId) return;
    try {
      const res = await axios.get(`${API_URL}/restaurant/${restaurantId}`, { headers });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders([]);
    }
  }, [restaurantId, token, headers]);

  useEffect(() => {
    loadOrders();
    const t = setInterval(loadOrders, 4000); // auto refresh mỗi 4s để đồng bộ với Admin
    return () => clearInterval(t);
  }, [loadOrders]);

  const handleStatusChange = async (orderId, nextStatus) => {
    try {
      await axios.patch(`${API_URL}/updateorder/${orderId}`, { status: nextStatus }, { headers });
      setOrders(prev => prev.map(o => (o._id === orderId ? { ...o, status: nextStatus } : o)));
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const nextOptions = (curr) => NEXT_BY_RESTAURANT[curr] || [];

  const renderAction = (o) => {
    const options = nextOptions(o.status);

    if (o.status === 'Payment pending') {
      return <p className="status-hint">⏳ Chờ Admin xác nhận thanh toán.</p>;
    }
    if (o.status === 'Your order is on its way to you') {
      return <p className="status-hint">🚚 Đang giao. Bước “Delivered” do Admin xác nhận.</p>;
    }
    if (o.status === 'Cancelled' || o.status === 'Your order has been delivered successfully') {
      return null;
    }
    if (options.length === 0) return null;

    // Chỉ 1 bước kế tiếp hợp lệ
    const next = options[0];
    return (
      <button
        onClick={() => handleStatusChange(o._id, next)}
        className="status-button"
      >
        {next}
      </button>
    );
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
                  const pname = product.name || product.productId?.name || 'Unnamed product';
                  return (
                    <li
                      key={product.productId?._id || product.productId || product._id || idx}
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
                  <p><strong>Name:</strong> {order.address.name}</p>
                  <p><strong>Address:</strong> {order.address.street}, {order.address.city}</p>
                  <p><strong>Phone:</strong> {order.address.phoneNumber}</p>
                  <p><strong>Pincode:</strong> {order.address.pincode}</p>
                </>
              ) : (
                <p>Shipping address not available.</p>
              )}
            </div>

            <div className="order-status">
              <p>
                <strong>Status:</strong>{' '}
                <span className={`status-${String(order.status).toLowerCase().replaceAll(' ', '-')}`}>
                  {order.status}
                </span>
              </p>
              {renderAction(order)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Order;
