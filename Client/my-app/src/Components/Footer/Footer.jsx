import React from 'react'
import './Footer.css'
import client from './client.png'
import user from './user.jpg'
import download from './download.png'
import download1 from '../Header/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTEwL2Rlc2lnbndpdGhtZTA5X2FfcmVhbGlzdGljX3Bob3RvX29mX2p1aWN5X2RvdWJsZV9tZWF0X2J1cmdlcl9yZV81YjAwNjMxNy1jMjQ0LTRlMWQtYTY0OS0xY.webp'
import { assets } from '../../Assets/assets'
function Footer() {
  return (
    <div>
        <section class="section-container banner__container">
    <div class="banner__card">
      <span class="banner__icon"><i class="ri-bowl-fill"></i></span>
      <h4>Order Your Food</h4>
      <p>
        Seamlessly place your food orders online with just a few clicks. Enjoy
        convenience and efficiency as you select from our diverse menu of
        delectable dishes.
      </p>
     
    </div>
    <div class="banner__card">
      <span class="banner__icon"><i class="ri-truck-fill"></i></span>
      <h4>Pick Your Food</h4>
      <p>
        Customize your dining experience by choosing from a tantalizing array
        of options. For savory, sweet, or in between craving, find the perfect
        meal to satisfy your appetite.
      </p>
     
    </div>
    <div class="banner__card">
      <span class="banner__icon"><i class="ri-star-smile-fill"></i></span>
      <h4>Enjoy Your Food</h4>
      <p>
        Sit back, relax, and savor the flavors as your meticulously prepared
        meal arrives. Delight in the deliciousness of every bite, knowing that
        your satisfaction is our top priority.
      </p>
     
    </div>
  </section>

      <section className="section__container client__container" id="client">
      <div className="client__image">
        <img src={client} alt="client" />
      </div>
      <div className="client__content">
        <p className="section__subheader">WHAT THEY SAY</p>
        <h2 className="section__header">What Our Customer Say About Us</h2>
        <p className="section__description">
          "Fudo is simply outstanding! The variety and deliciousness of their
          meals are unparalleled, offering something for every palate. What sets
          Fudo apart is their exceptional service. The delivery is impressively
          fast, ensuring your food arrives hot and fresh."
        </p>
        <div className="client__details">
          <img src={user} alt="client" />
          <div>
            <h4>Anjusha</h4>
            <h5>Food Enthusiast</h5>
          </div>
        </div>
      
      </div>
    </section>

    <section className="download__container" id="contact">
      <div className="section__container">
        <div className="download__image">
          <img src={download} alt="download" />
        </div>
        <div className="download__content">
          <p className="section__subheader">DOWNLOAD APP</p>
          <h2 className="section__header">Get Started With Fudo Today!</h2>
          <p className="section__description">
            Discover food wherever and whenever you want and get your food
            delivered on time, everytime.
          </p>
          <div className="download__btn">
            <button className="btnnn">Get The App</button>
          </div>
        </div>
      </div>
    </section>

   
    </div>

























  )
}

export default Footer