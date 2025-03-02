import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import { Badge, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { Category, Dashboard, DeleteOutlined, Groups, Inventory, LocalShipping, Logout, ManageAccounts, QrCodeScanner } from '@mui/icons-material';
import { MdCategory, MdSpaceDashboard, MdInventory, MdAccountCircle } from "react-icons/md";
import { FaProductHunt, FaTruck } from 'react-icons/fa';
import { AiFillProduct } from 'react-icons/ai';
import { FaUsers } from 'react-icons/fa6';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../features/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById } from '../features/userReducer';
import { deleteNotification, fetchNotifications, markNotificationAsRead } from '../features/NotificationReducer';
import { IoNotifications } from 'react-icons/io5';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CustomSnackbar from './components/common/Snackbar';

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [open, setOpen] = React.useState(!isMobile);
  const userId = localStorage.getItem("userId");
  const [user, setUser] = React.useState({});
  const { notifications, unreadCount } = useSelector((state) => state.notification);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);

  React.useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await dispatch(fetchUserById(userId)).unwrap();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [dispatch, userId])

  React.useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications(userId));
    }
  }, [dispatch, userId]);

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleDeleteNotification = (notificationId) => {
    dispatch(deleteNotification(notificationId));
  };

  const notificationMenu = (
    <Menu
      anchorEl={notificationAnchorEl}
      open={Boolean(notificationAnchorEl)}
      onClose={handleNotificationClose}
      PaperProps={{
        style: {
          maxHeight: '80vh',
          width: isMobile ? '100%' : '400px',
          maxWidth: '100%',
          padding: '8px 0',
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Typography variant="h6" sx={{ px: 2, py: 1, fontWeight: 'bold' }}>
        Notifications
      </Typography>
      <Divider />
      {notifications?.length === 0 ? (
        <MenuItem sx={{ justifyContent: 'center', py: 2 }}>
          <Typography color="text.secondary">No notifications</Typography>
        </MenuItem>
      ) : (
        notifications?.map((notification) => (
          <MenuItem 
            key={notification.id}
            sx={{
              display: 'block',
              padding: '12px 20px',
              whiteSpace: 'normal',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 1
              }}>
                <Typography
                  sx={{
                    fontWeight: notification.read ? 'normal' : 'bold',
                    flex: 1,
                    pr: 2,
                    wordBreak: 'break-word',
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}
                >
                  {notification.message}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.id);
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteOutlined fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ display: 'block' }}
              >
                {new Date(notification.timestamp).toLocaleString()}
              </Typography>
            </Box>
          </MenuItem>
        ))
      )}
    </Menu>
  );

  const toggleDrawer = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  }

  const profileMenu = (
    <Menu
      anchorEl={profileAnchorEl}
      open={Boolean(profileAnchorEl)}
      onClose={handleProfileMenuClose}
      PaperProps={{
        style: {
          maxHeight: '80vh',
          width: isMobile ? '100%' : '150px',
          maxWidth: '100%',
          padding: '8px 0',
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      
      <MenuItem onClick={handleProfileMenuClose} sx={{ py: 2 }}>
        <MdAccountCircle className="mr-2" size={20} />
        <Typography>My Profile</Typography>
      </MenuItem>
      <MenuItem onClick={handleLogout} sx={{ py: 2 }}>
        <Logout className="mr-2" />
        <Typography>Logout</Typography>
      </MenuItem>
    </Menu>
  );

  const baseMenuItems = [
    { text: 'Dashboard', icon: <Dashboard fontSize='medium' />, link: '/admin/dashboard' },
    { text: 'Inventory', icon: <Inventory fontSize='medium' />, link: '/admin/inventory' },
    { text: 'Category', icon: <Category fontSize='medium' />, link: '/admin/category' },
    { text: 'Products', icon: <QrCodeScanner fontSize='medium' />, link: '/admin/products' },
    { text: 'Sales & Purchases', icon: <ReceiptIcon fontSize='medium' />, link: '/admin/sales' },
    { text: 'Orders', icon: <LocalShipping fontSize='medium' />, link: '/admin/order' },
  ];

  const adminOnlyItems = [
    { text: 'Staffs', icon: <ManageAccounts fontSize='medium' />, link: '/admin/staffs' },
    { text: 'Customers', icon: <Groups fontSize='medium' />, link: '/admin/customers' },
  ];

  const menuItems = user.role === 'ROLE_MODERATOR' ? baseMenuItems : [...baseMenuItems, ...adminOnlyItems];

  const drawer = (
    <Box sx={{ mt: 2 }}>
      <List>
        {menuItems.map(({ text, icon, link }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton 
              component={Link} 
              to={link}
              onClick={isMobile ? toggleDrawer : undefined}
              sx={{
                minHeight: 48,
                px: 2.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                {icon}
              </ListItemIcon>
              {(open || isMobile) && <ListItemText primary={text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          textAlign: 'center',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Typography variant="h5" gutterBottom>
          Mobile Access Limited
        </Typography>
        <Typography>
          For the best experience, please access the admin dashboard from a desktop device.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {!isMobile ? (
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            width: open ? 250 : 73,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: open ? 250 : 73,
              boxSizing: 'border-box',
              backgroundColor: '#2f4f4f',
              color: 'white',
              transition: 'width 0.2s',
              overflowX: 'hidden'
            },
          }}
        >
          <Toolbar />
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: 250,
              boxSizing: 'border-box',
              backgroundColor: '#2f4f4f',
              color: 'white',
            },
          }}
        >
          <Toolbar />
          {drawer}
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={{ backgroundColor: '#2f4f4f', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {!isTablet && 'Agro Ecommerce'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isMobile && (
                <Typography sx={{ fontSize: isTablet ? '0.875rem' : '1rem' }}>
                  Welcome {user.firstName} ({user.role === 'ROLE_MODERATOR' ? 'Moderator' : 'Admin'})
                </Typography>
              )}
              <IconButton color="inherit" onClick={handleNotificationClick}>
                <Badge badgeContent={unreadCount} color="error">
                  <IoNotifications />
                </Badge>
              </IconButton>
              {notificationMenu}
              <IconButton
                edge="end"
                aria-label="account of current user"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <MdAccountCircle />
              </IconButton>
              {profileMenu}
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          <CustomSnackbar/>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
