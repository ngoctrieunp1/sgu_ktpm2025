import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Context } from '../../../Context/Context';
import axios from 'axios';


import blockuser from './download (1).png'
import { TfiLock } from "react-icons/tfi";
import { TfiUnlock } from "react-icons/tfi";
import toast from 'react-hot-toast';
function Allres() {
  const {  profile,setProfile,User,userId} = useContext(Context);
 const [ profiles, setProfiles] = useState([])
  const token = localStorage.getItem('token');
  useEffect(() => {
   
  axios.get(`http://localhost:4000/Allres`).then((res)=>{
    console.log('res',res);
  
    setProfiles(res.data)
  }).catch((err)=>{
    console.log(err);
  })

}, [ setProfiles])


const handleblock = (userId) => {
  axios.put(`http://localhost:4000/block/${userId}`, {}, {
    headers: {
      'Authorization':` Bearer ${token}`
    }
  }).then((res) => {
    const updatedProfiles = profiles.map(profile => {
      if (profile._id === userId ) {
        return { ...profile, blocked: true };
      }
      return profile;
    });
    setProfiles(updatedProfiles);
    toast.success('Successfully restaurant has been blocked!')
   
  }).catch((err) => {
    console.log(err);
  });
};

const handleunblock = (userId) => {
  axios.put(`http://localhost:4000/unblock/${userId}`).then((res) => {
    const updatedProfiles = profiles.map(profile => {
      if (profile._id === userId) {
        return { ...profile, blocked: false };
      }
      return profile;
    });
    setProfiles(updatedProfiles);
    alert("restaurant has been unblocked")
  }).catch((err) => {
    console.log(err);
  });
};
  return (
    <div >
    
    <div className='list add1 flex-col' >
      <p>All restaurant </p>
      <div className="list-table">
        <div className="list-table-format title">
          <b  style={{color:"black"}}>Name</b>
          <b  style={{color:"black"}}>Email</b>
          <b  style={{color:"black"}}>Role</b>
          
          <b  style={{color:"black"}}>Block</b>
        </div>
        {
  profiles.map((disp, index) => {
    return (
      <div key={index} className='list-table-format'>
        <p style={{color:"black"}}>{disp.name}</p>
        <p style={{color:"black"}}>{disp.email}</p>
        <p  style={{color:"black"}}>{disp.role}</p>
       
        {disp.blocked 
          ? <TfiUnlock style={{ fontSize: "20px", cursor: "pointer", marginLeft: "5px",color:"black"}} onClick={() => handleunblock(disp._id)} />
          : <TfiLock style={{ fontSize: "20px", cursor: "pointer", marginLeft: "5px" ,color:"red"}} onClick={() => handleblock(disp._id)} />
        }
      </div>
    )
  })
}

      </div>
    </div>
    </div>
  )
}

export default Allres