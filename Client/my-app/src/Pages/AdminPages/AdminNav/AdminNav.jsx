import React, { useContext, useState } from 'react'
import logo from './624c563065937551c9978359121ef58a.jpg'
// import './AdminNav.css'
import { AppBar, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '../../../Context/Context'
import propic from './download.png'
import logoutt from '../../../Assets/logout_icon.png';
import { IoMdLogOut } from 'react-icons/io';
import toast from 'react-hot-toast';


const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: '#f4f4f5',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#d3d3',
  },
}));




function AdminNav() {
  const {token,setToken,userId, isAuthorized,User }=useContext(Context)
  const Navigate=useNavigate()
  const logout=()=>{
    localStorage.removeItem("token")
    setToken("")
    toast.success('Logged out successfully!')
    Navigate("/login")
    }
    const [drawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = () => {
      setDrawerOpen(!drawerOpen);
    };
  return (
    <div className='navbar'>
    {/* <img src={logo} alt="" className='logo'/>
    <ul className='nav-menu'>
    </ul>
    <div className="navbar-right">
     <div className="nav-search-icon">
    
    </div>
    {!token?<Link to={'/login'}><button>Login</button></Link>:
    <div className='propic'>
     <img src={propic} alt="" style={{width:"70px",height:"70px"}} />
     <ul className='nav-dropdown1'>
       <li onClick={logout}><img src={  logoutt} alt="" style={{width:"30px"}} /></li>
     </ul>
    </div>
    }
    </div> */}
      <div>
  
       <AppBar position="static" style={{color:"white"}}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" aria-label="menu" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{ marginLeft: '16px' }}>
              Admin Panel
            </Typography>
          </div>
           
          {token && (
            <div style={{ display: 'flex', alignItems: 'center',marginLeft:"800px" }}>
              <img src={propic} alt="User Profile" style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: '16px' }} />
              <ul className='nav-dropdown1' style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                <li onClick={logout} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <IoMdLogOut size={30} style={{ marginRight: '8px' }} />
                  <Typography>Logout</Typography>
                </li>
              </ul>
            </div>
          )}
          
        </Toolbar>
       
      </AppBar>

<StyledDrawer variant="temporary" open={drawerOpen} onClose={toggleDrawer} ModalProps={{keepMounted:true}}>
      <Toolbar />
      {/* <div>
        <Typography variant="h6" style={{ padding: '16px',color:'green'}}>
          Admin Panel
        </Typography>
      </div> */}
      <Divider />
      <List>
        <StyledListItem button component={Link} to="/AdminDashboard">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" style={{ color: '#333' }} />
        </StyledListItem>
        <StyledListItem button component={Link} to='/getallusers'>
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Users" style={{ color: '#333' }} />
        </StyledListItem>
        <StyledListItem button component={Link} to='/getallres'>
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="restaurant " style={{ color: '#333' }} />
        </StyledListItem>
        <StyledListItem button component={Link} to='/listAllitems'>
        <ListItemIcon><WorkIcon /></ListItemIcon>
          <ListItemText primary="List All Items" style={{ color: '#333' }} />
        </StyledListItem>
        <StyledListItem button component={Link} to='/getallorders'>
          <ListItemIcon><AssignmentIcon /></ListItemIcon>
          <ListItemText primary="Orders" style={{ color: '#333' }} />
        </StyledListItem>
        <StyledListItem button component={Link} to='/getallreviews'>
          <ListItemIcon><AssignmentIcon /></ListItemIcon>
          <ListItemText primary="Reviews" style={{ color: '#333' }} />
        </StyledListItem>
        <button onClick={logout} style={{width:"130px",height:"30px",borderRadius:"5px",marginLeft:"10px",marginTop:"10px"}}><IoMdLogOut /></button>
      </List>
    </StyledDrawer>
  </div>
   </div>
  )
}

export default AdminNav