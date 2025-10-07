import React, { useContext, useEffect, useMemo, useState } from 'react';
import '../Navbar/Navbar.css';

import basket_icon from '../../Assets/basket_icon.png';
import profile from '../../Assets/profile_icon.png';
import logoutt from '../../Assets/logout_icon.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Context } from '../../Context/Context';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

function Navbar() {
  const { token: ctxToken, setToken, userId: ctxUserId, isAuthorized, User } = useContext(Context);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Fallback từ localStorage nếu Context chưa có
  const token = useMemo(() => ctxToken || localStorage.getItem('token') || '', [ctxToken]);
  const userId = useMemo(() => ctxUserId || localStorage.getItem('userId') || '', [ctxUserId]);
  const role   = useMemo(() => (User?.role) || localStorage.getItem('role') || '', [User]);

  useEffect(() => {
    // Log nhẹ để debug
    // console.log('[Navbar] token?', !!token, 'userId:', userId, 'role:', role);
  }, [token, userId, role, isAuthorized, User]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setToken?.('');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const toggleMenu = () => setShow(s => !s);
  const closeMenu = () => setShow(false);

  // Đường dẫn profile luôn đúng dạng /profile/:userId
  const profilePath = userId ? `/profile/${userId}` : '/login';
  // Cart cũng cần userId để giữ đúng route đang dùng
  const cartPath = userId ? `/cart/${userId}` : '/login';

  return (
    <div className="navbar">
      <div className="hamburger" onClick={toggleMenu}>
        {show ? <FaTimes /> : <FaBars />}
      </div>

      <ul className={`nav-menu ${show ? 'nav-menu-active' : ''}`}>
        <Link to="/home" style={{ textDecoration: 'none', color: '#49557e' }} onClick={closeMenu}>
          <li className={location.pathname === '/home' ? 'active' : ''}>Home</li>
        </Link>
        <Link to="/menu" style={{ textDecoration: 'none', color: '#49557e' }} onClick={closeMenu}>
          <li className={location.pathname === '/menu' ? 'active' : ''}>Menu</li>
        </Link>
        <Link to="/myorder" style={{ textDecoration: 'none', color: '#49557e' }} onClick={closeMenu}>
          <li className={location.pathname === '/myorder' ? 'active' : ''}>Order</li>
        </Link>
        <Link to={cartPath} onClick={closeMenu} style={{ textDecoration: 'none' }}>
          <li>
            <img src={basket_icon} alt="Basket" />
          </li>
        </Link>
      </ul>

      <div className="navbar-right">
        {!token ? (
          <Link to="/login">
            <button>Login</button>
          </Link>
        ) : (
          <div className="propic">
            <FaUserCircle fontSize="30px" />
            <ul className="navbar-dropdown1">
              <li>
                <Link to={profilePath} style={{ textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={profile} alt="Profile" style={{ width: 20 }} />
                  <span>Profile</span>
                </Link>
              </li>
              <hr />
              <li onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <img src={logoutt} alt="Logout" style={{ width: 27 }} />
                <span>Logout</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
