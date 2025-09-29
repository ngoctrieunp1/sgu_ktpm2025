import React, { useContext, useState } from 'react';
import '../Login/Login.css'; // Assuming you're reusing the same styles for consistency
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../axios';
import { Context } from '../../Context/Context';
import toast from 'react-hot-toast';

function Signup() {
  const { setToken } = useContext(Context);
  const [form, setform] = useState({ name: "", email: "", password: "", role: "" });
  const navigate = useNavigate();

  const updateform = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handleupdate = async () => {
    api.post("/register", form)
      .then((res) => {
        const data = res.data;
        setToken(data.token);
        toast.success('"Account created successfully!"')
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err)
      });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-title">
          <h2>Create Account</h2>
          <p>Sign up with your details</p>
        </div>
        <form
          onChange={updateform}
          onSubmit={(e) => {
            e.preventDefault();
            handleupdate();
          }}
        >
          <div className="login-input">
            <input
              type="text"
              placeholder="Name"
              required
              name="name"
              value={form.name}
            />
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={form.email}
            />
            <select
              name="role"
              value={form.role}
              onChange={updateform}
              required
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="Restaurant">Restaurant</option>
              {/* <option value="Admin">Admin</option> */}
            </select>
            <input
              type="password"
              placeholder="Password"
              required
              name="password"
              value={form.password}
            />
          </div>
          
          <button className="login-button">Sign Up</button>
          <div className="login-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" style={{textDecoration:"none"}}>
                <span>Login here</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
