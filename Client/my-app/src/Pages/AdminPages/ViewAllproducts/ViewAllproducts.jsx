import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './ViewAllproducts.css'
import { NavLink } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { GiSightDisabled } from "react-icons/gi";
import toast from 'react-hot-toast';
function ViewAllproducts() {
  const [view, setview] = useState([])
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get("http://localhost:4000/view").then((res)=>{
      console.log(res);
      setview(res.data)
    }).catch((err)=>{
      console.log(err)
    })
    
  }, [])

  const remove=(id)=>{
    axios.delete(`http://localhost:4000/remove/${id}`,{
      headers: {
          'Authorization': `Bearer ${token}`
      }
  }).then((res)=>{
      console.log(res);
      const delet= view.filter(item=>item._id!==id)
      setview(delet)
      
    }).catch((err)=>{
      console.log(err);
    })
}

const toggleproductstatus = async (id, currentstatus) => {
  try {
      const res = await axios.patch(`http://localhost:4000/toggleproduct/${id}`);
      if (res.status === 200) {
        toast.success(res.data.message)
          setview((prevproducts) =>
              prevproducts.map((disp) =>
                  disp._id === id ? { ...disp, disabled: !currentstatus } : disp
              )
          );
      } else {
          
      }
  } catch (err) {
      
      console.log('Error updating product status:', err);
  }
};
  return (
    <div style={{display:"flex"}}>
    
    
    <div className='list add1 flex-col' style={{marginLeft:"10px"}}>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {
          view.map((disp,index)=>{
            return(
              <div key={index} className='list-table-format'>
               <img src={disp.image} alt=""  />
                <p style={{color:"black"}}>{disp.name}</p>
                <p style={{color:"black"}}>{disp.category}</p>
                <p style={{color:"black"}}>${disp.price}</p>
                {/* <MdDelete style={{fontSize:"20px",cursor:"pointer",color:"white"}} onClick={()=>remove(disp._id)}/> */}
                {disp.disabled ? (
    <GiSightDisabled style={{fontSize:"30px",paddingTop:"5px",color:"red"}} onClick={() => toggleproductstatus(disp._id, disp.disabled)} className="action-button toggle-button" />
) : (
    <IoMdEye style={{fontSize:"30px",paddingTop:"5px"}} onClick={() => toggleproductstatus(disp._id, disp.disabled)}  className="action-button toggle-button"/>
) }
                
              </div>
            )
          })
        }
      </div>
    </div>
    </div>
  )
}

export default ViewAllproducts