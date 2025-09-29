import React, { useEffect, useState } from 'react';
import axios from "axios";
import './List.css';
import { Link } from 'react-router-dom';

function List() {
  const [view, setView] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get("http://localhost:4000/view", {
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

  return (
    <div className='food-disp'>
      <h2>Explore Top dishes near you</h2>
      <div className="food-disp-list">
        {view.slice().reverse().map((disp) => (  // Reverse the view array for LIFO display
          <div className='food-item' key={disp._id}>
            <div className="food-item-container">
              <Link to={`/product/${disp._id}`}>
                <img src={disp.image} alt="" className='food-item-img' />
              </Link>
            </div>
            <div className="food-item-info">
              <div className="food-item-name-rating">
                <p>{disp.name}</p>
              </div>
              <p className='food-item-descrip'>{disp.description}</p>
              <p className='food-item-price'>${disp.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default List;
