import React from 'react'
import './ExploreMenu.css'
import {menu_list} from "../../Assets/assets"
import servicejpg1 from './service-1.jpg'
import servicejpg2 from './service-2.jpg'
import servicejpg3 from './service-3.jpg'
function ExploreMenu({category,setcategory}) {
  return (
    <div className='explore-menu'>
        <h1> Discover Our Culinary Delights</h1>
        <p className="explore-menu-text">Indulge in a wide variety of dishes, each prepared with care and passion. From classic favorites to innovative creations, our menu promises to delight your taste buds and provide a memorable dining experience. Join us for a culinary journey that celebrates flavor and quality.</p>
        <div className="explore-menu-list">
           {menu_list.map((item,index)=>{
            return (
                <div onClick={()=>setcategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={index} className="explore-menu-list-item" >
                <img className={category===item.menu_name ? "active":""} src={item.menu_image} alt=""  />
                <p>{item.menu_name}</p>
                </div>
            )
           })}
            </div>
           
           <hr/>
      <section class="section__container service__container" id="service">
      <p className="section__subheader">WHAT WE SERVE</p>
      <h2 className="section__header">Your Favourite Food Delivery Partner</h2>
      <div className="service__grid">
        <div className="service__card">
          <img src={servicejpg1 } alt="service" />
          <h4>Easy To Order</h4>
          <p>You only need a few steps in ordering food</p>
        </div>
        <div className="service__card">
          <img src={servicejpg2} alt="service" />
          <h4>Fastest Delivery</h4>
          <p>Delivery that is always ontime even faster</p>
        </div>
        <div className="service__card">
          <img src={servicejpg3} alt="service" />
          <h4>Best Quality</h4>
          <p>Not only fast for us quality is also number one</p>
        </div>
      </div>
    </section>
    <hr/>
      </div>
            
        
   
  )
}

export default ExploreMenu