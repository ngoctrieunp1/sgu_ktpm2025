import React, { useContext, useEffect, useState } from 'react';
import './FoodItem.css';
import axios from 'axios';
import { Context } from '../../Context/Context';
import { Link } from 'react-router-dom';

function FoodItem() {
  const [view, setView] = useState([]);
  const { addCart } = useContext(Context);

  useEffect(() => {
    axios.get("http://localhost:4000/view")
      .then((res) => {
        const activeProduct = res.data.filter((disps) => !disps.disabled);
        setView(activeProduct);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className='food-disp'>
      <h2>Order Your Favourite Food Here</h2>
      <div className="food-disp-list" style={{ color: "black", textDecoration: "none" }}>
        {view.slice().reverse().map((disp) => (  // Reverse the view array to display items in LIFO order
          <div className='food-item' key={disp._id}>
            <div className="food-item-container">
              <Link to={`/product/${disp._id}`}><img src={disp.image} alt="" className='food-item-img' /></Link>
              <button onClick={() => addCart(disp._id)} className='carttt'>Add to Cart</button>
            </div>
            <div className="food-item-info">
              <div className="food-item-name-rating">
                <p style={{ color: "black", textDecoration: "none" }}>{disp.name}</p>
              </div>
              <p className='food-item-descrip'>{disp.description}</p>
              <p className='food-item-price'>${disp.price}</p>
              <div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FoodItem;

