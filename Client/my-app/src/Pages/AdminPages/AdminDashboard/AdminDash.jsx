import React, { useEffect, useState } from 'react'
import "./AdminDash.css"
import { FaUtensils, FaDollarSign, FaMapMarkerAlt, FaMotorcycle, FaClock, FaUsers, FaRoute } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AdminDash = () => {
  const Navigate=useNavigate()
    const [users, setusers] = useState(0)
    const [products, setproducts] = useState(0)
    const [resturant, setres] = useState(0)
    const [totalOrder, settotalOrder] = useState(0)
    const [totalTurnover, setTotalTurnover] = useState(0);

    useEffect(() => {
        axios.get(`http://localhost:4000/usercount`).then((res)=>{
            console.log('res',res);
          
          setusers(res.data.count);
          }).catch((err)=>{
            console.log(err);
          })
          axios.get("http://localhost:4000/productcount").then((res)=>{
            console.log(res);
            setproducts(res.data.count)
          }).catch((err)=>{
            console.log(err)
          })
          axios.get("http://localhost:4000/rescount").then((res)=>{
            console.log(res);
            setres(res.data.count);
          }).catch((err)=>{
            console.log(err)
          })
          axios.get("http://localhost:4000/Ordercount").then((res)=>{
            console.log(res);
            settotalOrder(res.data.count);
          }).catch((err)=>{
            console.log(err)
          })
          axios.get("http://localhost:4000/turnover").then((res) => {
            setTotalTurnover(res.data.turnover);
        }).catch((err) => console.log(err));
    }, [])
    
    const stats = [
        { title: 'Total Users', count: users, icon: <FaUsers />, color: '#FFC107 ',route:"/getallusers" },
        { title: 'Total Resturant\'s', count: resturant, icon: <FaMapMarkerAlt />, color: '#6F42C1',route:"/getallres" },
        { title: 'Total Products', count: products, icon:  <FaUtensils />, color: '#17A2B8' ,route:"/listAllitems"},
        { title: 'Total Order\'s', count:totalOrder, icon: <FaClock />, color: '#4a90e2',route:"/getallorders" },
        { title: 'Total Turnover', count: `$${totalTurnover}`, icon: <FaDollarSign />, color: '#28A745' }
      ];
  return (
    <div className="dashboard">
    <div className="dashboard-header">
      <h1>Dashboard</h1>
    </div>
    
    <div className="dashboard-stats" >
      {stats.map((stat, index) => (
        <div className="stat-card" key={index} style={{ backgroundColor: stat.color }} onClick={()=>Navigate(stat.route)}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-info">
            <h3>{stat.count}</h3>
            <p>{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
    </div>
  )
}

export default AdminDash