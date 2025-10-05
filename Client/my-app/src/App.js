// import React, { useContext, useEffect } from 'react';
// import './App.css';
// import UserRoutes from './Router/UserRoutes';
// import HotelRoutes from './Router/HotelRoutes';
// import { jwtDecode } from 'jwt-decode';
// import { Context } from './Context/Context';
// import AdminPage from './Router/AdminPage';
// import { Toaster } from 'react-hot-toast';

// function App() {
//   const { setAuthorized, setUser, User } = useContext(Context);

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       setAuthorized(false);
//       setUser(null);
//       // Xoá rác cũ nếu có
//       localStorage.removeItem('userId');
//       localStorage.removeItem('role');
//       return;
//     }

//     try {
//       const decoded = jwtDecode(token);
//       // Tuỳ cấu trúc token của bạn, thường bạn đang dùng decoded.sub
//       const sub = decoded?.sub || decoded || {};

//       setAuthorized(true);
//       setUser(sub);

//       // Lưu lại cho Navbar/Router dùng
//       if (sub?._id) localStorage.setItem('userId', sub._id);
//       if (sub?.role) localStorage.setItem('role', sub.role);
//     } catch (err) {
//       console.error('Invalid token', err);
//       setAuthorized(false);
//       setUser(null);
//       localStorage.removeItem('token');
//       localStorage.removeItem('userId');
//       localStorage.removeItem('role');
//     }
//   }, [setAuthorized, setUser]);

//   return (
//     <div className="App">
//       {User ? (
//         User.role === 'Admin' ? (
//           <AdminPage />
//         ) : User.role === 'Restaurant' ? (
//           <HotelRoutes />
//         ) : (
//           <UserRoutes />
//         )
//       ) : (
//         <UserRoutes />
//       )}
//       <Toaster />
//     </div>
//   );
// }

// export default App;


//////////////////////////////////////////////////////////////////////////////////

import React, { useContext, useEffect } from "react";
import "./App.css";
import UserRoutes from "./Router/UserRoutes";
import HotelRoutes from "./Router/HotelRoutes";
import AdminPage from "./Router/AdminPage";
import { jwtDecode } from "jwt-decode";
import { Context } from "./Context/Context";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import Login from "./Pages/Login/Login";

function App() {
  const { setAuthorized, setUser, User, setRole, token } = useContext(Context);

  useEffect(() => {
    const localToken = token || localStorage.getItem("token");
    if (!localToken) {
      setAuthorized(false);
      setUser(null);
      setRole("");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      return;
    }

    try {
      const decoded = jwtDecode(localToken);
      const sub = decoded?.sub || decoded || {};

      setAuthorized(true);
      setUser(sub);

      const normalizedRole = String(sub?.role || "").toLowerCase();

      if (sub?._id) localStorage.setItem("userId", sub._id);
      if (normalizedRole) localStorage.setItem("role", normalizedRole);
      setRole(normalizedRole);
    } catch (err) {
      console.error("Invalid token", err);
      setAuthorized(false);
      setUser(null);
      setRole("");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
    }
  }, [setAuthorized, setUser, setRole, token]);

  if (!localStorage.getItem("token")) {
    return (
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  }

  const role = localStorage.getItem("role");

  return (
    <div className="App">
      {role === "admin" ? (
        <AdminPage />
      ) : role === "restaurant" ? (
        <HotelRoutes />
      ) : (
        <UserRoutes />
      )}
      <Toaster />
    </div>
  );
}

export default App;
