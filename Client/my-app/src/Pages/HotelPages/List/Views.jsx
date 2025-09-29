import React, { useEffect, useState } from 'react';
import axios from "axios";
import '../List/List.css';
import { Link } from 'react-router-dom';
import { GiSightDisabled } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import toast from 'react-hot-toast';

function Views() {
  const [view, setView] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get("http://localhost:4000/myproduct", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      console.log(res);
      setView(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }, [token]);

  const remove = (id) => {
    axios.delete(`http://localhost:4000/remove/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      console.log(res);
      const updatedView = view.filter(item => item._id !== id);
      setView(updatedView);
      toast.success('Product deleted successfully!')
    }).catch((err) => {
      console.log(err);
    });
  };

  const toggleProductStatus = async (id, currentStatus) => {
    try {
      const res = await axios.patch(`http://localhost:4000/toggleproduct/${id}`);
      if (res.status === 200) {
        toast.success(res.data.message)
        setView((prevProducts) =>
          prevProducts.map((disp) =>
            disp._id === id ? { ...disp, disabled: !currentStatus } : disp
          )
        );
      } else {
        console.log("Failed to update product status.");
      }
    } catch (err) {
      console.log('Error updating product status:', err);
    }
  };

  return (
    <div className='food-disp'>
      <h2>Our dishes</h2>
      <div className="food-disp-list">
        {view.slice().reverse().map((disp) => (  // Reverse the view array for LIFO
          <div className='food-item' key={disp._id}>
            <div className="food-item-container">
              <img src={disp.image} alt="" className='food-item-img' />
            </div>
            <div className="food-item-info">
              <div className="food-item-name-rating">
                <p>{disp.name}</p>
              </div>
              <p className='food-item-descrip'>{disp.description}</p>
              <p className='food-item-price'>${disp.price}</p>
              <div className="dlt-edit-logo">
                <Link to={`/update/${disp._id}`}>
                  <MdEdit style={{ fontSize: "30px" }} className="action-button edit-button" />
                </Link>
                <MdDelete onClick={() => remove(disp._id)} style={{ fontSize: "30px", paddingTop: "5px" }} className="action-button delete-button" />
                {disp.disabled ? (
                  <GiSightDisabled style={{ fontSize: "30px", paddingTop: "5px", color: "red" }} onClick={() => toggleProductStatus(disp._id, disp.disabled)} className="action-button toggle-button" />
                ) : (
                  <IoMdEye style={{ fontSize: "30px", paddingTop: "5px" }} onClick={() => toggleProductStatus(disp._id, disp.disabled)} className="action-button toggle-button" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Views;
