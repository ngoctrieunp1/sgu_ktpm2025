// import React from 'react'
// import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import Home from '../Pages/UserPages/Home/Home'
// import Cart from '../Pages/UserPages/Cart/Cart'
// import Login from '../Pages/Login/Login'
// import Signup from '../Pages/Signup/Signup'
// import Navbar from '../Components/Navbar/Navbar'
// import Menu from '../Pages/UserPages/Menu/Menu'
// import Footer from '../Components/Footer/Footer'
// import Profile from '../Components/Profile/Profile'
// import SingleView from '../Components/SingleView/SingleView'
// import ProfileUpdate from '../Components/Profile/ProfileUpdate'
// import Myorders from '../Components/MyOrders/Myorders'
// import PlaceOrder from '../Pages/UserPages/PlaceOrder/PlaceOrder'
// import SearchProduct from '../Components/SearchProduct/SearchProduct'
// import Header from '../Components/Header/Header'
// import ExploreMenu from '../Components/ExploreMenu/ExploreMenu'

// function UserRoutes() {
//   return (
//     <div>
      
//         <BrowserRouter>
       
//         <Routes>
//             <Route path='/' element={<> <Navbar/><Home/><Footer/></>}></Route>
//             <Route path='/home' element={<>  <Navbar/><Home/><Footer/></>}></Route>
//             <Route path='/menu' element={<>  <Navbar/><Menu/></>}></Route>
//             <Route path='/cart/:userId' element={ <><Navbar/><Cart/></>}></Route>
//             <Route path='/myorder' element={<><Navbar/><Myorders/></>}></Route>
//             <Route path='/placeorder' element={<><Navbar/><PlaceOrder/></>}></Route>
//             <Route path='/login' element={<><Login/></> }></Route>
//             <Route path='/sign-up' element={<><Signup/></> }></Route>
//             <Route path='/profile/:id' element={<><Navbar/><Profile/></> }></Route>
//             <Route path='/profileUpdate/:id' element={<><Navbar/><ProfileUpdate/></> }></Route>
//             <Route path='/product/:id' element={<><Navbar/><SingleView/></>}></Route>
//             <Route path='/searchproduct' element={<><Navbar/><SearchProduct/><Footer/></>}></Route>
           
//        </Routes>
      
//         </BrowserRouter>
        
//     </div>
//   )
// }

// export default UserRoutes

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from '../Pages/UserPages/Home/Home';
import Cart from '../Pages/UserPages/Cart/Cart';
import Login from '../Pages/Login/Login';
import Signup from '../Pages/Signup/Signup';
import Navbar from '../Components/Navbar/Navbar';
import Menu from '../Pages/UserPages/Menu/Menu';
import Footer from '../Components/Footer/Footer';
import Profile from '../Components/Profile/Profile';
import SingleView from '../Components/SingleView/SingleView';
import ProfileUpdate from '../Components/Profile/ProfileUpdate';
import Myorders from '../Components/MyOrders/Myorders';
import PlaceOrder from '../Pages/UserPages/PlaceOrder/PlaceOrder';
import SearchProduct from '../Components/SearchProduct/SearchProduct';

function UserRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<><Navbar /><Home /><Footer /></>} />
        <Route path='/home' element={<><Navbar /><Home /><Footer /></>} />
        <Route path='/menu' element={<><Navbar /><Menu /></>} />
        <Route path='/cart/:userId' element={<><Navbar /><Cart /></>} />
        <Route path='/myorder' element={<><Navbar /><Myorders /></>} />
        <Route path='/placeorder' element={<><Navbar /><PlaceOrder /></>} />
        <Route path='/login' element={<><Login /></>} />
        <Route path='/sign-up' element={<><Signup /></>} />

        {/* Profile có id */}
        <Route path='/profile/:id' element={<><Navbar /><Profile /></>} />
        <Route path='/profileUpdate/:id' element={<><Navbar /><ProfileUpdate /></>} />

        {/* Redirect khi vào /profile (không id) */}
        <Route
          path='/profile'
          element={
            localStorage.getItem('userId')
              ? <Navigate to={`/profile/${localStorage.getItem('userId')}`} replace />
              : <Navigate to='/login' replace />
          }
        />

        <Route path='/product/:id' element={<><Navbar /><SingleView /></>} />
        <Route path='/searchproduct' element={<><Navbar /><SearchProduct /><Footer /></>} />

        {/* optional: 404 */}
        {/* <Route path='*' element={<Navigate to='/' replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default UserRoutes;
