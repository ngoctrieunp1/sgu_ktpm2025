// import axios from 'axios';
// import React, { useContext, useEffect } from 'react';
// import './Profile.css';
// import edit1 from '../../Pages/HotelPages/icons8-edit-25 (1).png';
// import { Link } from 'react-router-dom';
// import { Context } from '../../Context/Context';

// function Profile() {
//     const { userId, token, profile, setProfile } = useContext(Context);

//     useEffect(() => {
//         if (token) {
//             axios.get(`http://localhost:4000/proview/${userId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             }).then(res => {
//                 setProfile(res.data);
//             }).catch(err => {
//                 console.error(err);
//             });
//         }
//     }, [userId, setProfile, token]);

//     if (!profile) {
//         return <div className="loading">Loading...</div>;
//     }

//     return (
//         <div className="profile">
//             <h2>Welcome, {profile.name}!</h2>
//             <div className='profile-item'>
//                 <div className="profile-details">
//                     <p><strong>Name:</strong> {profile.name}</p>
//                     <p><strong>Email:</strong> {profile.email}</p>
//                     <p><strong>Role:</strong> {profile.role}</p>
//                 </div>
//                 <div className="edit-logo">
//                     <Link to={`/profileUpdate/${profile._id}`}>
//                         <img src={edit1} alt="Edit Profile" />
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Profile;

/////////////////////////////////////////////////////////////////////////////////// //////////////////////////////////////////////////////////////////////////


// import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, Link } from "react-router-dom";
// import "./Profile.css";
// import edit1 from "../../Pages/HotelPages/icons8-edit-25 (1).png";
// import { Context } from "../../Context/Context";

// function Profile() {
//   const { id } = useParams();                  // /profile/:id
//   const { userId, token } = useContext(Context);

//   // nếu URL chưa có id, dùng userId trong Context
//   const effectiveId = id || userId;

//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchProfile() {
//       try {
//         const res = await axios.get(`http://localhost:4000/profile/${effectiveId}`, {
//           headers: { Authorization: `Bearer ${token}` }, // nếu BE yêu cầu auth
//         });
//         setProfile(res.data); // { _id, name, email, role }
//       } catch (err) {
//         console.error("Load profile failed:", err?.response || err);
//         setProfile(null);
//       } finally {
//         setLoading(false);
//       }
//     }
//     if (effectiveId) fetchProfile();
//   }, [effectiveId, token]);

//   if (loading) return <div className="loading">Loading...</div>;
//   if (!profile) return <div className="loading">Không tải được hồ sơ.</div>;

//   return (
//     <div className="profile">
//       <h2>Welcome, {profile.name}!</h2>

//       <div className="profile-item">
//         <div className="profile-details">
//           <p><strong>Name:</strong> {profile.name}</p>
//           <p><strong>Email:</strong> {profile.email}</p>
//           <p><strong>Role:</strong> {profile.role}</p>
//         </div>

//         <div className="edit-logo">
//           <Link to={`/profileUpdate/${profile._id}`}>
//             <img src={edit1} alt="Edit Profile" />
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;

////////////////////////////////////////////////////////////////////////////////////////////////////////


import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./Profile.css";
import edit1 from "../../Pages/HotelPages/icons8-edit-25 (1).png";
import { Context } from "../../Context/Context";

const API = "http://localhost:4000";

function Profile() {
  const { id } = useParams();
  const { userId, token } = useContext(Context);
  const effectiveId = id || userId;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setMsg("");
      try {
        // thử endpoint /profile trước
        const r1 = await axios.get(`${API}/profile/${effectiveId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setProfile(r1.data);
      } catch (e1) {
        // nếu 404 hoặc lỗi, thử lại /proview
        try {
          const r2 = await axios.get(`${API}/proview/${effectiveId}`, {
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
    </div>
  );
}

export default Profile;

