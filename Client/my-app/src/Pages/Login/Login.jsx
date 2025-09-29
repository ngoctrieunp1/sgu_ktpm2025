// import React, { useContext, useEffect, useState } from 'react';
// import './Login.css';
// import { jwtDecode } from 'jwt-decode';
// import { Link, useNavigate } from 'react-router-dom';
// import { api } from '../../axios';
// import { Context } from '../../Context/Context';
// import toast from 'react-hot-toast';

// function Login() {
//   const { token, setToken, setUserId } = useContext(Context);
//   const [login, setlogin] = useState({ email: '', password: '' });

//   const updateform = (e) => {
//     setlogin({ ...login, [e.target.name]: e.target.value });
//   };

//   const navigate = useNavigate();

//   const handleupdate = () => {
//     api.post('/login', login)
//       .then((res) => {
//         const data = res.data;
//         localStorage.setItem('token', data.token);
//         const decodedToken = jwtDecode(data.token);
//         setToken(data.token);
//         setUserId(decodedToken.sub._id);
//         toast.success('Loggined Successfully!')
//         navigate('/');
//       })
//       .catch((err) => {
//         const errorMessage = err.response?.data || 'Login failed. Please check your credentials.';
//         if (errorMessage === 'Your account is blocked. Please contact support.') {
//           toast.error('Your account is blocked. Please contact support.');
//         } else {
//           toast.error(errorMessage);
//         }
//       });
//   };

//   useEffect(() => {
//     console.log(login);
//   }, [login]);

//   const storedToken = localStorage.getItem('token');
//   if (storedToken) {
//     const decodedToken = jwtDecode(storedToken);
//     setToken(storedToken);
//     setUserId(decodedToken.sub._id);
//   }

//   return (
//     <div className="login-page">
//       <div className="login-container">
//         <div className="login-title">
//           <h2>Welcome Back!</h2>
//           <p>Please enter your details</p>
//         </div>
//         <form
//           onChange={updateform}
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleupdate();
//           }}
//         >
//           <div className="login-input">
//             <input
//               type="email"
//               placeholder="Email"
//               required
//               name="email"
//               value={login.email}
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               required
//               name="password"
//               value={login.password}
//             />
//           </div>
//           <div className="login-footer">
//             <button className="login-button">Sign In</button>
//             <p>
//               Don't have an account?{' '}
//               <Link to="/sign-up" style={{textDecoration:"none"}}>
//                 <span>Create one here</span>
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


import React, { useContext, useEffect, useState } from 'react';
import './Login.css';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../axios';
import { Context } from '../../Context/Context';
import toast from 'react-hot-toast';

function Login() {
  const { setToken, setUserId } = useContext(Context);
  const [login, setLogin] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const updateForm = (e) => {
    setLogin((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Helper lấy userId/role từ nhiều format khác nhau
  const extractAuthInfo = (rawResData) => {
    // log để nhìn rõ backend trả gì (xem tab Console)
    console.log('[/login] response data =', rawResData);

    const token =
      rawResData?.token ||
      rawResData?.accessToken ||
      rawResData?.jwt ||
      rawResData?.data?.token;

    // các khả năng có user / userId / role
    const userObj =
      rawResData?.user ||
      rawResData?.data?.user ||
      rawResData?.profile ||
      rawResData?.data?.profile;

    let userId =
      rawResData?.userId ||
      rawResData?.id ||
      rawResData?._id ||
      rawResData?.data?.userId ||
      rawResData?.data?.id ||
      rawResData?.data?._id ||
      userObj?._id;

    let role =
      rawResData?.role ||
      rawResData?.data?.role ||
      userObj?.role;

    // nếu chưa có userId/role thì thử decode token
    if (token) {
      try {
        const payload = jwtDecode(token);
        // nhiều backend nhét ở: sub._id | sub | id | _id | userId
        if (!userId) {
          userId =
            payload?.sub?._id ||
            payload?.sub ||
            payload?.id ||
            payload?._id ||
            payload?.userId ||
            userId;
        }
        if (!role) {
          role = payload?.role || role;
        }
      } catch (e) {
        // token không phải JWT hợp lệ -> bỏ qua decode
      }
    }

    return { token, userId, role };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', login);
      const { token, userId, role } = extractAuthInfo(res.data);

      if (!token) {
        throw new Error('No token returned from server');
      }

      // nếu vẫn thiếu userId / role, đừng chặn login — gán mặc định
      const finalUserId = userId || 'unknown';
      const finalRole = role || 'user'; // cho phép vào app

      // Lưu localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', finalUserId);
      localStorage.setItem('role', finalRole);

      // Set vào Context
      setToken(token);
      setUserId(finalUserId);

      toast.success('Logged in successfully!');

      // Điều hướng theo role (nếu chưa rõ role thì về /home)
      if (String(finalRole).toLowerCase() === 'restaurant') {
        navigate('/orders');
      } else {
        navigate('/home');
      }
    } catch (err) {
      console.error(err);
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        'Login failed. Please check your credentials.';
      if (typeof apiMsg === 'string' && apiMsg.toLowerCase().includes('blocked')) {
        toast.error('Your account is blocked. Please contact support.');
      } else {
        toast.error(apiMsg);
      }
    }
  };

  // Khởi tạo từ localStorage 1 lần khi mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
    }
  }, [setToken, setUserId]);

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-title">
          <h2>Welcome Back!</h2>
          <p>Please enter your details</p>
        </div>

        <form onSubmit={handleSubmit} onChange={updateForm}>
          <div className="login-input">
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={login.email}
              onChange={updateForm}
            />
            <input
              type="password"
              placeholder="Password"
              required
              name="password"
              value={login.password}
              onChange={updateForm}
            />
          </div>
          <div className="login-footer">
            <button className="login-button" type="submit">
              Sign In
            </button>
            <p>
              Don&apos;t have an account?{' '}
              <Link to="/sign-up" style={{ textDecoration: 'none' }}>
                <span>Create one here</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
