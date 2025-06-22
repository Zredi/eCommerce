import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Outlet, useNavigate } from 'react-router-dom';
import { FaCartShopping, FaUser } from 'react-icons/fa6';
import { IoCart, IoHeart, IoHome, IoLogOut, IoNotifications } from "react-icons/io5";
import { MdAccountCircle } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCart } from '../features/cartReducer';
import { logout, validateToken } from '../features/authReducer';
import { deleteNotification, fetchNotifications, markNotificationAsRead } from '../features/NotificationReducer';
import { Divider, InputAdornment, TextField, Tooltip } from '@mui/material';
import { DeleteOutlined, Logout, Person, Person2, Person3, PersonOutline, Search } from '@mui/icons-material';
import Footer from './Footer';
import { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import { fetchProducts } from '../features/ProductReducer';
import { SearchIcon } from 'lucide-react';
import { isTokenExpired } from '../utils/jwtUtils';
import CustomSnackbar from './common/Snackbar';
import { fetchWishlist } from '../features/WishlistReducer';

const BASE_URL = process.env.REACT_APP_ECOMMERCE_API_ENDPOINT.replace('/api/v1', '');

export default function UserLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { authData, loading, error } = useSelector((state) => state.auth);
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userId = authData?.userId;
  const { cart } = useSelector((state) => state.cart);
  const { notifications, unreadCount } = useSelector((state) => state.notification);
  const { products } = useSelector((state) => state.product);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = React.useRef(null);
  const searchContainerRef = React.useRef(null);
  // const isLoggedIn = localStorage.getItem("isLoggedIn");

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);




  // const userId = localStorage.getItem("userId");

  console.log('authData', authData);

  const handleLogout = React.useCallback(() => {
    dispatch(logout());
    navigate('/home');
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
  }, [dispatch, navigate]);


  useEffect(() => {
    dispatch(validateToken());
  }, [dispatch]);


  React.useEffect(() => {
    if (isLoggedIn && userId && authData?.token && !isTokenExpired(authData.token)) {
      dispatch(fetchUserCart(userId));
      dispatch(fetchNotifications(userId));
      dispatch(fetchWishlist(userId));
      dispatch(fetchProducts());
    }

  }, [dispatch, isLoggedIn, userId, authData?.token]);


  React.useEffect(() => {
    if (isLoggedIn && authData?.token && isTokenExpired(authData.token)) {
      handleLogout();
    }
  }, [isLoggedIn, authData?.token, handleLogout]);

  useEffect(() => {
    if (isLoggedIn) {
      setShowAuthModal(false);
    }
  }, [isLoggedIn]);

  console.log('products', products);

  const cartItemsCount = React.useMemo(() => {
    if (!cart?.items) return 0;
    return cart.items.length;
  }, [cart?.items]);

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery || !Array.isArray(products)) return [];
    const query = searchQuery.toLowerCase().trim();
    return products
      .filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [searchQuery, products]);

  const handleSwitchToLogin = (email) => {
    setLoginEmail(email || '');
    setAuthMode('login');
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleProfileClick = () => {
    navigate("/account");
    setAnchorEl(null);
    handleMobileMenuClose();
  }

  const handleOrderClick = () => {
    navigate("/orders");
    setAnchorEl(null);
    handleMobileMenuClose();
  }



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


  const handleSearchSelect = (productId) => {
    navigate(`/product-details/${productId}`);
    setSearchQuery('');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const notificationMenu = (
    <Menu
      anchorEl={notificationAnchorEl}
      open={Boolean(notificationAnchorEl)}
      onClose={handleNotificationClose}
      PaperProps={{
        style: {
          maxHeight: '80vh',
          width: '400px',
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
                    wordBreak: 'break-word'
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

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      sx={{ mt: 5 }}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >

      <MenuItem onClick={handleProfileClick}><PersonOutline /> &nbsp; My Account</MenuItem>
      {/* <MenuItem onClick={handleOrderClick}>My Orders</MenuItem> */}
      <MenuItem onClick={handleLogout}><Logout /> &nbsp; Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const handleCartIconClick = () => {
    navigate('/shopping-bag')
  }


  const authProps = {
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    isLoggedIn
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: '#3498DB' }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, cursor: 'pointer', display: { sm: 'block', xs: 'none' } }}
            onClick={() => navigate('/home')}
          >
            Ecommerce
          </Typography>

          <Box sx={{ flexGrow: 1, maxWidth: 500, mx: 'auto', position: 'relative' }} ref={searchContainerRef}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search products by name or brand..."
              value={searchQuery}
              onChange={handleSearchChange}
              inputRef={searchInputRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 20,
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#bdbdbd',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3498DB',
                  },
                },
              }}
            />
            {searchQuery.trim() && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderRadius: '4px',
                  zIndex: 1300,
                  maxHeight: '300px',
                  overflowY: 'auto',
                  mt: 1,
                }}
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Box
                      key={product.id}
                      onClick={() => handleSearchSelect(product.id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        padding: '12px 16px',
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f5f5f5' },
                      }}
                    >
                      <img
                        src={product.images?.[0]?.downloadUrl ? `${BASE_URL}${product.images[0].downloadUrl}` : 'https://via.placeholder.com/50'}
                        alt={product.name}
                        style={{ width: 50, height: 50, objectFit: 'contain' }}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                      />
                      <Box>
                        <Typography variant="body1" color='text.primary'>{product.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{product.brand}</Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ padding: '12px 16px', textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      No results found
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <IconButton onClick={() => navigate('/home')} size="medium" color="inherit">
              <IoHome />
            </IconButton>

            {isLoggedIn && !isTokenExpired(authData?.token) ? (
              <>
                <Tooltip title="Cart">
                  <IconButton onClick={handleCartIconClick} size="large" color="inherit">
                    <Badge badgeContent={cartItemsCount} color="error">
                      <IoCart />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Wishlist">
                <IconButton onClick={handleCartIconClick} size="large" color="inherit">
                  <Badge badgeContent={5} color="error">
                    <IoHeart />
                  </Badge>
                </IconButton>
                </Tooltip>
                <Tooltip title="Notifications">
                <IconButton
                  onClick={handleNotificationClick}
                  color="inherit"
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <IoNotifications size={26} />
                  </Badge>
                </IconButton>
                </Tooltip>
                <IconButton
                  size="large"
                  edge="end"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <MdAccountCircle />
                </IconButton>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  className="bg-white text-[#3498DB]  px-4 py-1.5 rounded-full font-medium transition-colors hover:scale-105"
                >
                  Login
                </button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {notificationMenu}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAuthModal(false)}
          />
          <div className="relative z-50">
            {authMode === 'login' ? (
              <Login onRegisterClick={() => setAuthMode('register')} initialEmail={loginEmail} />
            ) : (
              <Register onLoginClick={handleSwitchToLogin} />
            )}
          </div>
        </div>
      )}

      <Box component="main" sx={{ flexGrow: 1 }}>
        <CustomSnackbar />
        <Outlet context={authProps} />
      </Box>
      <Footer />
    </Box>
  );
}
