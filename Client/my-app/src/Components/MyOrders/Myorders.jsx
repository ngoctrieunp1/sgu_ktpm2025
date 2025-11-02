import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../Context/Context';
import parcel from '../../Assets/admin_assets/parcel_icon.png';
import jsPDF from 'jspdf';
import './myorder.css';
import toast from 'react-hot-toast';

const QR_URL = 'https://scontent.fsgn5-1.fna.fbcdn.net/v/t1.15752-9/566702663_1712219139468150_1685015265997950894_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeGFDy-g86JSU7Ogh7_OsGCHNXugFYP_-KY1e6AVg__4pr0_Q8SZJ_96RRnNaEkubh6G15D36K1J7JHQQH8ZAPew&_nc_ohc=EEokug0D_U0Q7kNvwG6fCSm&_nc_oc=AdkSjSj5-QZqi3GN5L703v31DJPUwzxzD-_ilzHpdK9GfSirOT7hmkQwFIT34Zs-t64GV9-cmC4xKeK0IlGf41V0&_nc_zt=23&_nc_ht=scontent.fsgn5-1.fna&oh=03_Q7cD3gEh6jYB_n3oiC7kHi2SqDrGJMlXmXGWGGFYGCVwesyfhg&oe=69285FEC';

function Myorders() {
  const { userId } = useContext(Context);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/getOrdersByUser/${userId}`);
        setOrders(Array.isArray(res.data) ? res.data : []);
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
    (order.products || []).forEach((product, index) => {
      const pname = product.name || product.productId?.name || 'Unnamed';
      const productDetails = `${pname} (x${product.quantity}) - $${product.price ?? ''}`;
      doc.text(productDetails, 10, 50 + index * 10);
    });
    doc.text(
      `Total Amount: $${order.totalAmount}`,
      10,
      70 + (order.products?.length || 0) * 10
    );
    if (order.address) {
      doc.text('Shipping Address:', 10, 80 + (order.products?.length || 0) * 10);
      doc.text(
        `${order.address.name}, ${order.address.street}, ${order.address.city}`,
        10,
        90 + (order.products?.length || 0) * 10
      );
      doc.text(
        `Phone: ${order.address.phoneNumber}, Pincode: ${order.address.pincode}`,
        10,
        100 + (order.products?.length || 0) * 10
      );
    }

    // In status (ưu tiên payment_status nếu có)
    const statusText = order.payment_status || order.status || 'N/A';
    doc.text(`Order Status: ${statusText}`, 10, 120 + (order.products?.length || 0) * 10);

    doc.save(`invoice_${order._id}.pdf`);
  };

  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmCancel) return;

    try {
      const res = await axios.put(`http://localhost:4000/cancelOrder/${orderId}`);
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: 'Cancelled', payment_status: order.payment_status ?? 'Payment pending' } : order
          )
        );
        toast.success('Order canceled successfully!');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      toast.error('Failed to cancel order');
    }
  };

  return (
    <div className="my-orders-container">
      {orders.length > 0 ? (
        orders
          .slice()
          .reverse()
          .map((order) => {
            // Hỗ trợ cả kiểu cũ (order.status) lẫn mới (order.payment_status)
            const paymentStatus = order.payment_status || order.status || '';
            const isPaymentPending = paymentStatus === 'Payment pending';

            return (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <img src={parcel} alt="Parcel Icon" className="order-icon" />
                  <h2>Order #{order._id}</h2>
                </div>

                <div className="order-details">
                  <ul className="order-products">
                    {(order.products || []).length > 0 ? (
                      order.products.map((product, idx) => {
                        const pname = product.name || product.productId?.name || 'Unnamed';
                        return (
                          <li
                            key={
                              product.productId?._id ||
                              product.productId ||
                              product._id ||
                              idx
                            }
                          >
                            {pname} x {product.quantity}
                          </li>
                        );
                      })
                    ) : (
                      <li>No products found for this order.</li>
                    )}
                  </ul>

                  <p className="total-price">
                    <strong>Total Price:</strong> ${order.totalAmount}
                  </p>

                  {order.address ? (
                    <div className="order-address">
                      <p>
                        {order.address.name}, {order.address.street}, {order.address.city}
                      </p>
                      <p>
                        {order.address.phoneNumber}, {order.address.pincode}
                      </p>
                    </div>
                  ) : (
                    <p>Shipping address not available.</p>
                  )}

                  {/* ✅ Hiển thị QR khi Payment pending */}
                  {isPaymentPending && (
                    <div style={{ marginTop: 12 }}>
                      <p style={{ marginBottom: 8, fontWeight: 600 }}>
                        Vui lòng quét QR để thanh toán
                      </p>
                      <img
                        src={QR_URL}
                        alt="QR thanh toán"
                        style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8 }}
                        loading="lazy"
                      />
                    </div>
                  )}

                  <p className="order-status" style={{ marginTop: 12 }}>
                    <strong>Status:</strong> {paymentStatus}
                  </p>

                  <button
                    className="track-order-btn"
                    onClick={() => downloadInvoice(order)}
                  >
                    Download Invoice
                  </button>

                  {/* Ẩn nút Cancel nếu không còn Payment pending */}
                  {isPaymentPending && (
                    <button
                      className="cancel-order-btn"
                      onClick={() => cancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })
      ) : (
        <p style={{ padding: 16 }}>Bạn chưa có đơn hàng nào.</p>
      )}
    </div>
  );
}

export default Myorders;
