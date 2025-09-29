import React from 'react'
import './SideBAr.css'
import { NavLink } from 'react-router-dom'
function SideBar() {
  return (
    <div className='sidebar'>
    <div className="sidebar-options">
      <NavLink to='/getallusers' style={{textDecoration:"none",color: "white"}} className="sidebar-option">
        
        <p>Users</p>
      </NavLink>
      <NavLink to='/listAllitems' style={{textDecoration:"none",color: "white"}} className="sidebar-option">
       
        <p>List All Items</p>
      </NavLink>
      <NavLink to='/getallorders' style={{textDecoration:"none",color: "white"}} className="sidebar-option">
      
        <p>Orders</p>
      </NavLink>
      <NavLink to='/getallreviews'style={{textDecoration:"none",color: "white"}} className="sidebar-option">
     
        <p>Reviews</p>
      </NavLink>
    </div>
  </div>
  )
}

export default SideBar