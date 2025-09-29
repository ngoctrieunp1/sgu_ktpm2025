import React, { Children, useContext } from 'react'
import AdminNav from '../Pages/AdminPages/AdminNav/AdminNav'
import SideBar from '../Pages/AdminPages/Sidebar/SideBar'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import GetAllusers from '../Pages/AdminPages/AllUsers/GetAllusers'
import ViewAllproducts from '../Pages/AdminPages/ViewAllproducts/ViewAllproducts'
import AllOrders from '../Pages/AdminPages/AllOrders/AllOrders'
import AllReviews from '../Pages/AdminPages/AllReviews/AllReviews'
import Login from '../Pages/Login/Login'
import Signup from '../Pages/Signup/Signup'
import { Context } from '../Context/Context'
import AdminDash from '../Pages/AdminPages/AdminDashboard/AdminDash'
import Allres from '../Pages/AdminPages/AllRestuarent/Allres'


// const Adminpages=({Children})=>{
//   const {User}=useContext(Context);
//   if(!User || User.role !== 'Admin'){
//     return <Navigate to='/login'/>
//   }
//   return Children;
// }


function AdminPage() {
  return (
    <div>
         <BrowserRouter>
        
        <Routes>
            <Route path='/' element={ <><AdminNav/><AdminDash/></> }></Route>
            <Route path='/AdminDashboard' element={ <><AdminNav/><AdminDash/></> }></Route>
            <Route path='/getallusers' element={ <><AdminNav/><GetAllusers/></> }></Route>
            <Route path='/getallres' element={ <><AdminNav/><Allres/></> }></Route>
            <Route path='/listAllitems' element={ <><AdminNav/><ViewAllproducts/></> }></Route>
            <Route path='/getallorders' element={ <><AdminNav/><AllOrders/></> }></Route>
            <Route path='/getallreviews' element={ <><AdminNav/><AllReviews/></> }></Route>
            <Route path='/login' element={<><Login/></> }></Route>
            <Route path='/sign-up' element={<><Signup/></> }></Route>
        </Routes>
        </BrowserRouter>
    </div>
  )
}

export default AdminPage