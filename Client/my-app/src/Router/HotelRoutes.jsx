
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import RestNav from '../Components/RestaurantNavbar/RestNav';

import Login from '../Pages/Login/Login';
import Signup from '../Pages/Signup/Signup';
import Add from '../Pages/HotelPages/Add/Add';
import List from '../Pages/HotelPages/List/List';
import Order from '../Pages/HotelPages/Orders/Order';
import Hotelhome from '../Pages/HotelPages/Hotelhome';
import Profile from '../Components/Profile/Profile';
import Viewupdate from '../Pages/HotelPages/List/Viewupdate';
import Review from '../Pages/HotelPages/Review/Review';
import Views from '../Pages/HotelPages/List/Views';
import ProfileUpdate from '../Components/Profile/ProfileUpdate';
import Singleviews from '../Pages/HotelPages/List/Singleviews';
import ReviewSingleView from '../Pages/HotelPages/Review/ReviewSingleView';
import ExploreMenu from '../Components/ExploreMenu/ExploreMenu';
import Header from '../Components/Header/Header';
import SearchProduct from '../Components/SearchProduct/SearchProduct';
import Footer from '../Components/Footer/Footer';

function HotelRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<><RestNav /><Hotelhome /><Footer /></>} />
        <Route path='/home' element={<><RestNav /><Hotelhome /><Footer /></>} />
        <Route path='/add-item' element={<><RestNav /><Add /></>} />
        <Route path='/list-item' element={<><RestNav /><Views /></>} />
        <Route path='/update/:id' element={<><RestNav /><Viewupdate /></>} />
        <Route path='/view' element={<><RestNav /><List /></>} />
        <Route path='/orders' element={<><RestNav /><Order /></>} />
        <Route path='/restaurant/reviews' element={<><RestNav /><Review /></>} />
        <Route path='/login' element={<><Login /></>} />
        <Route path='/sign-up' element={<><Signup /></>} />

        {/* Profile có id */}
        <Route path='/profile/:id' element={<><RestNav /><Profile /></>} />
        <Route path='/profileUpdate/:id' element={<><RestNav /><ProfileUpdate /></>} />

        {/* Redirect khi vào /profile (không id) */}
        <Route
          path='/profile'
          element={
            localStorage.getItem('userId')
              ? <Navigate to={`/profile/${localStorage.getItem('userId')}`} replace />
              : <Navigate to='/login' replace />
          }
        />

        <Route path='/product/:id' element={<><RestNav /><Singleviews /></>} />
        <Route path='/product/getReviews/:id' element={<><RestNav /><ReviewSingleView /></>} />
        <Route path='/searchproduct' element={<><RestNav /><Header /><ExploreMenu /><SearchProduct /><Footer /></>} />

        {/* optional: 404 */}
        {/* <Route path='*' element={<Navigate to='/' replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default HotelRoutes;
