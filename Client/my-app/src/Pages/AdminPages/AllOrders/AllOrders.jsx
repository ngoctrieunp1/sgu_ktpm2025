import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import './AllOrders.css';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:4000';

function AllOrders() {
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const loadOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/Allorders`, { headers });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Không tải được danh sách đơn');
    }
  }, [headers]);

  useEffect(() => {
    loadOrders();
    const t = setInterval(loadOrders, 4000); // đồng bộ mỗi 4s
    return () => clearInterval(t);
  }, [loadOrders]);

  // Admin chỉ được đổi 2 bước:
  // 1) Payment pending -> Payment completed
  // 2) Your order is on its way to you -> Your order has been delivered successfully
  const getAdminNextOptions = (status) => {
    if (status === 'Payment pending') return ['Payment completed'];
    if (status === 'Your order is on its way to you') {
      return ['Your order has been delivered successfully'];
    }
    return [];
  };

  const handleAdminStatusChange = async (orderId, nextStatus) => {
    try {
      await axios.patch(
        `${API_URL}/updateorder/${orderId}`,
        { status: nextStatus },
        { headers }
      );
      // cập nhật lạc quan
      setOrders(prev =>
        prev.map(o => (o._id === orderId ? { ...o, status: nextStatus } : o))
      );
      toast.success(`Đã chuyển sang "${nextStatus}"`);
      // nạp lại từ server để chắc chắn đồng bộ
      loadOrders();
    } catch (e) {
      console.error('Change status error:', e);
      toast.error(e?.response?.data?.message || e.message || 'Cập nhật thất bại');
    }
  };

  const renderStatusCell = (order) => {
    const options = getAdminNextOptions(order.status);

    if (options.length === 0) {
      // chỉ hiển thị trạng thái hiện tại
      return <span>{order.status}</span>;
    }

    // có đúng 1 lựa chọn tiếp theo -> render dropdown đơn giản
    return (
      <select
        value={order.status}
        onChange={(e) => handleAdminStatusChange(order._id, e.target.value)}
        style={{ padding: 4, borderRadius: 6 }}
      >
        <option value={order.status}>{order.status}</option>
        {options.map(op => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>
    );
  };

  return (
    <div style={{ display: 'flex' }}>
      <div className="list add1 flex-col" style={{ marginLeft: '10px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <p>All Order Lists</p>
          {/* <button onClick={loadOrders} style={{ padding:'6px 10px', borderRadius:6 }}>
            Refresh
          </button> */}
        </div>

        <div className="list-table1">
          <div className="list-table-format title1">
            <b style={{color:'black'}}>Product Name</b>
            <b style={{color:'black'}}>Quantity</b>
            <b style={{color:'black'}}>Total Price</b>
            <b style={{color:'black'}}>Restaurant Name</b>
            <b style={{color:'black'}}>Address</b>
            <b style={{color:'black'}}>Status</b>
          </div>

          {orders.map((order, index) => (
            <div key={index} className="list-table-format1">
              {/* Product Name */}
              <p style={{color:'black'}}>
                {(order.products || []).map(p => (
                  <div key={p.productId}>{p.name}</div>
                ))}
              </p>

              {/* Quantity */}
              <p style={{color:'black'}}>
                {(order.products || []).map(p => (
                  <div key={p.productId}>{p.quantity}</div>
                ))}
              </p>

              {/* Total */}
              <p style={{color:'black'}}>${order.totalAmount}</p>

              {/* Restaurant Name (tạm hiển thị id nếu chưa populate tên) */}
              <p style={{color:'black'}}>
                {(order.products || []).map(p => (
                  <div key={p.productId}>{String(p.restaurantId || '')}</div>
                ))}
              </p>

              {/* Address */}
              <p style={{color:'black'}}>
                {order.address ? (
                  <>
                    {order.address.name}, {order.address.street}, {order.address.city}<br/>
                    {order.address.phoneNumber}, {order.address.pincode}
                  </>
                ) : 'Shipping address not available.'}
              </p>

              {/* Status (theo quyền Admin) */}
              <p style={{color:'black'}}>
                {renderStatusCell(order)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllOrders;
