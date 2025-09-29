// import React, { useContext, useEffect } from 'react'
// import './App.css';
// import UserRoutes from './Router/UserRoutes';
// import HotelRoutes from './Router/HotelRoutes';
// import { jwtDecode } from 'jwt-decode';
// import { Context } from './Context/Context';
// import AdminPage from './Router/AdminPage';
// import toast,{Toaster} from 'react-hot-toast'


// function App() {
  
//   const {isAuthorized, setAuthorized,User,setUser}=useContext(Context);

//   console.log(User);
  

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
    
//     if (storedToken) {
//       try {
//         const decodedToken = jwtDecode(storedToken);
//         setAuthorized(true);
//         setUser(decodedToken.sub);
//         console.log(setUser);
//       } catch (error) {
//         console.error("Invalid token", error);
//         setAuthorized(false);
//         setUser(null);
      
//       }
//     }
//   }, [setUser,isAuthorized]);
//   // if (User){
//   //   if(User.role === 'Restaurant'){
//   //     return <HotelRoutes/> ;
//   //   }else if(User.role === 'Admin'){
//   //     return <AdminPage/>
//   //   }else {
//   //     return  <UserRoutes/> ;
//   //   }
//   // }


 
//   return (
//     <div className="App">


     
//      { User ? (
//         User.role === 'Admin' ?   <AdminPage/> :
//         User.role === 'Restaurant' ? <HotelRoutes /> :
//         <UserRoutes />
//       ) : (
//         <UserRoutes /> // Default to user routes if no user is authenticated
//       )}
//       {/* <AdminPage/>  */}
//       <Toaster/>
//     </div>

    
   
     
    
  
//   );
// }

// export default App;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useContext, useEffect } from 'react';
import './App.css';
import UserRoutes from './Router/UserRoutes';
import HotelRoutes from './Router/HotelRoutes';
import { jwtDecode } from 'jwt-decode';
import { Context } from './Context/Context';
import AdminPage from './Router/AdminPage';
import { Toaster } from 'react-hot-toast';

function App() {
  const { setAuthorized, setUser, User } = useContext(Context);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setAuthorized(false);
      setUser(null);
      // Xoá rác cũ nếu có
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      // Tuỳ cấu trúc token của bạn, thường bạn đang dùng decoded.sub
      const sub = decoded?.sub || decoded || {};

      setAuthorized(true);
      setUser(sub);

      // Lưu lại cho Navbar/Router dùng
      if (sub?._id) localStorage.setItem('userId', sub._id);
      if (sub?.role) localStorage.setItem('role', sub.role);
    } catch (err) {
      console.error('Invalid token', err);
      setAuthorized(false);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
    }
  }, [setAuthorized, setUser]);

  return (
    <div className="App">
      {User ? (
        User.role === 'Admin' ? (
          <AdminPage />
        ) : User.role === 'Restaurant' ? (
          <HotelRoutes />
        ) : (
          <UserRoutes />
        )
      ) : (
        <UserRoutes />
      )}
      <Toaster />
    </div>
  );
}

export default App;
