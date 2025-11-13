

import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config";

export const Context = createContext({ isAuthorized: false });

const ContextProvider = (props) => {
  const [isAuthorized, setAuthorized] = useState(false);
  const [User, setUser] = useState(null);
  const [cartItem, setcartItem] = useState({});
  const [view, setview] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || "");
  const [role, setRole] = useState(() => localStorage.getItem("role") || "");
  const [profile, setProfile] = useState({});
  const [cartItems, setCartItems] = useState([]);

  // ✅ Lưu lại vào localStorage khi có thay đổi
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    if (userId) localStorage.setItem("userId", userId);
    if (role) localStorage.setItem("role", role);
  }, [token, userId, role]);

  // 🧹 Logout: xoá sạch dữ liệu khi đăng xuất
  const logout = () => {
    setAuthorized(false);
    setUser(null);
    setcartItem({});
    setview([]);
    setToken("");
    setUserId("");
    setRole("");
    setProfile({});
    setCartItems([]);
    localStorage.clear();
  };

  // 🛒 Lấy giỏ hàng khi có userId
  useEffect(() => {
    if (userId) {
      axios
        .get(`${API_BASE_URL}/cart/${userId}`)
        .then((res) => {
          const cartData = res.data.reduce((acc, item) => {
            acc[item.itemId] = item.quantity;
            return acc;
          }, {});
          setcartItem(cartData);
        })
        .catch((err) => console.log(err));
    }
  }, [userId]);

  const addCart = (itemId) => {
    setcartItem((prev) => {
      const newCart = { ...prev };
      newCart[itemId] = (newCart[itemId] || 0) + 1;

      axios
        .post(`${API_BASE_URL}/addCart`, {
          itemId,
          quantity: 1,
          userId,
        })
        .then(() => toast.success("Product added to cart!"))
        .catch((err) => console.log(err));

      return newCart;
    });
  };

  const removCart = (itemId, quantity) => {
    setcartItem((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > quantity) newCart[itemId] -= quantity;
      else delete newCart[itemId];

      axios
        .post(`${API_BASE_URL}/remove/${itemId}`, { itemId, userId, quantity })
        .then(() => toast.success("Removed item from cart!"))
        .catch((err) => console.log(err));

      return newCart;
    });
  };

  const handleIncrement = async (itemId) => {
    try {
      const item = cartItems.find((item) => item.itemId === itemId);
      if (item) {
        const newQuantity = item.quantity + 1;
        item.quantity = newQuantity;
        setCartItems([...cartItems]);
        await axios.post(`${API_BASE_URL}/cart/update/${itemId}`, {
          userId,
          quantity: newQuantity,
        });
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const handleDecrement = async (itemId) => {
    try {
      const item = cartItems.find((item) => item.itemId === itemId);
      if (item && item.quantity > 1) {
        const newQuantity = item.quantity - 1;
        item.quantity = newQuantity;
        setCartItems([...cartItems]);
        await axios.post(`${API_BASE_URL}/cart/decrement/${itemId}`, {
          userId,
          quantity: newQuantity,
        });
      } else if (item && item.quantity === 1) {
        setCartItems(cartItems.filter((i) => i.itemId !== itemId));
        await axios.post(`${API_BASE_URL}/remove/${itemId}`, { userId });
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const product = view.find((product) => product._id === item.itemId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const contextValue = {
    cartItem,
    setcartItem,
    addCart,
    removCart,
    view,
    setview,
    token,
    setToken,
    userId,
    setUserId,
    role,
    setRole,
    profile,
    setProfile,
    cartItems,
    setCartItems,
    getTotalPrice,
    isAuthorized,
    setAuthorized,
    User,
    setUser,
    handleIncrement,
    handleDecrement,
    logout,
    clearCart: () => setCartItems([]),
  };

  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;
