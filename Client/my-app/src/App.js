import React, { useContext, useEffect } from "react";
import "./App.css";
import UserRoutes from "./Router/UserRoutes";
import HotelRoutes from "./Router/HotelRoutes";
import AdminPage from "./Router/AdminPage";
import { jwtDecode } from "jwt-decode";
import { Context } from "./Context/Context";
import { Toaster } from "react-hot-toast";

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

  const tokenExist = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <div className="App">
      {!tokenExist ? (
        // 👉 Khi chưa đăng nhập, render hệ thống router user
        <UserRoutes />
      ) : role === "admin" ? (
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
