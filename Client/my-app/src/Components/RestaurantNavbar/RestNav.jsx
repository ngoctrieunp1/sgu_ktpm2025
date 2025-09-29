import React, { useContext, useState } from 'react'
import './RestNav.css'

import { Link, useNavigate, useParams } from 'react-router-dom'
import { Context } from '../../Context/Context'
import propic from './chef-icon-with-tray-food-hand_602006-191.avif'
import logoutt from '../../Assets/logout_icon.png';
import  profile from '../../Assets/profile_icon.png'
import { FaBars, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'
function RestNav() {
  const {id}=useParams()
    const [menus, setmenus] = useState('home')
    const [show, setshow] = useState(false);
    const {token,setToken,userId }=useContext(Context)
    const Navigate=useNavigate()
    const logout=()=>{
      localStorage.removeItem("token")
      setToken("")
      toast.success('Logged out successfully!')
      Navigate("/login")
      }
      const toggleMenu = () => {
        setshow(!show);
      };
      const closeMenu =()=>{
        setshow(false);
      }
      
    
  return (
    <div className='navbar'>
   {/* <Link to='/'> <img src={logo} alt="" className='logo'/></Link> */}
   <div className='hamburger' onClick={toggleMenu}>
        {show ? <FaTimes /> : <FaBars />} 
      </div>
    <ul className={`nav-menu ${show ? 'nav-menu-active' : ''}`}>
     <Link to='/home' style={{textDecoration:"none",color: "#49557e"}}><li onClick={()=>{setmenus('home'); closeMenu()}} className={menus==='home'?'active':""} >Home</li></Link> 
     <Link to='/add-item' style={{textDecoration:"none",color: "#49557e"}}> <li onClick={()=>{setmenus('menu'); closeMenu()}} className={menus==='menu'?'active':""}>Add-Items</li></Link> 
     <Link to='/list-item' style={{textDecoration:"none",color: "#49557e"}}> <li onClick={()=>{setmenus('mobile-app'); closeMenu()}}  className={menus==='mobile-app'?'active':""}>List-Items</li></Link> 
     <Link to='/orders' style={{textDecoration:"none",color: "#49557e"}}><li onClick={()=>{setmenus('contact'); closeMenu()}} className={menus==='contact'?'active':""}>Orders</li></Link>
     <Link to={`/restaurant/reviews`} style={{textDecoration:"none",color: "#49557e"}}><li onClick={()=>{setmenus('review'); closeMenu()}} className={menus==='review'?'active':""}>Reviews</li></Link>
    </ul>
    <div className="navbar-right">
     
    {!token?<Link to={'/login'}><button>Login</button></Link>:
     <div className='propic'>
      <img src={propic} alt="" style={{width:"70px",height:"70px"}}/>
      <ul className='navbar-dropdown1'>
       <Link to={`/profile/${userId}`} style={{textDecoration:"none",color:"black"}}><img src={ profile} alt="" style={{width:"25px"}} /></Link>
        <hr />
        <li onClick={logout}><img src={  logoutt} alt="" style={{width:"30px"}}/></li>
      </ul>
     </div>
     }
   </div>
    </div>
  )
}
  
export default RestNav