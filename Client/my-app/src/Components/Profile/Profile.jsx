import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./Profile.css";
import edit1 from "../../Pages/HotelPages/icons8-edit-25 (1).png";
import { Context } from "../../Context/Context";
import { API_BASE_URL } from "../../config";

const API_URL = API_BASE_URL || "http://localhost:4000";

function Profile() {
  const { id } = useParams();
  const { userId, token } = useContext(Context);
  const effectiveId = id || userId;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const r1 = await axios.get(`${API_URL}/profile/${effectiveId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setProfile(r1.data);
      } catch (e1) {
        try {
          const r2 = await axios.get(`${API_URL}/proview/${effectiveId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          });
          setProfile(r2.data);
        } catch (e2) {
          console.error("Load profile failed:", e2?.response || e2);
          setMsg("Không tải được hồ sơ.");
          setProfile(null);
        }
      } finally {
        setLoading(false);
      }
    }
    if (effectiveId) fetchProfile();
  }, [effectiveId, token]);

  const fetchDeliveredOrders = async () => {
    if (!startDate || !endDate) {
      alert("Vui lòng chọn khoảng thời gian");
      return;
    }
    try {
      const res = await axios.get(`${API}/getDeliveredOrders`, {
        params: {
          restaurantId: effectiveId,
          startDate,
          endDate,
        },
      });
      setDeliveredOrders(res.data.orders || []);
      setTotalAmount(res.data.totalAmount || 0);
      setTotalCount(res.data.totalCount || 0);
    } catch (err) {
      console.error("fetchDeliveredOrders error:", err);
      setDeliveredOrders([]);
      setTotalAmount(0);
      setTotalCount(0);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!profile) return <div className="loading">{msg || "Không tải được hồ sơ."}</div>;

  return (
    <div className="profile">
      <h2>Welcome, {profile.name}!</h2>
      <div className="profile-item">
        <div className="profile-details">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
        </div>
        <div className="edit-logo">
          <Link to={`/profileUpdate/${profile._id}`}>
            <img src={edit1} alt="Edit Profile" />
          </Link>
        </div>
      </div>

      {profile.role === "Restaurant" && (
        <div className="delivered-stats">
          <h3>📊 Thống kê đơn hàng Delivered</h3>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ marginLeft: "8px" }}
            />
            <button onClick={fetchDeliveredOrders} style={{ marginLeft: "10px" }}>
              Filter Orders
            </button>
          </div>

          {deliveredOrders.length === 0 ? (
            <p>Không có đơn hàng trong khoảng thời gian đã chọn.</p>
          ) : (
            <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "10px" }}>
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Giá tiền</th>
                  <th>Chiết khấu (15%)</th>
                  <th>Thu nhập (85%)</th>
                </tr>
              </thead>
              <tbody>
                {deliveredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>${order.totalAmount}</td>
                    <td>${order.totalAmount*0.15}</td>
                    <td>${order.totalAmount*0.85}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: "bold" }}>
                  <td>Tổng ({totalCount} đơn)</td>
                  <td>${totalAmount}</td>
                  <td>${totalAmount*0.15}</td>
                  <td>${totalAmount*0.85}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
