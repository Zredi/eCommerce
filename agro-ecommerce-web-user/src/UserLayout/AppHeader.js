import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { styled, alpha } from "@mui/material/styles";

import InputBase from "@mui/material/InputBase";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../actions/message";
import { userShoppingBagByUserId, userShoppingBags } from "../features/UserShoppingReducer";
import { profileApi, profileApiByUserId } from "../features/profileReducer";
import { fetchProducts } from "../features/ProductReducer";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

function UserAppHeader() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [productCount, setProductCount] = useState(0);
  const { authData } = useSelector((state) => state.auth);
  const { userShoppingBags } = useSelector((state) => state.userShoppingBag);
  const [userShoppingBag,setUserShoppingBag] = useState(null);
  const [user,setUser] = useState(null);
  const location = useLocation();
  const dispatch = useDispatch();

  const mobileMenuId = "primary-search-account-menu-mobile";

  const menuId = "primary-search-account-menu";
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  useEffect(() => {
    if (["/login", "/register"].includes(location.pathname)) {
      dispatch(clearMessage()); // clear message when changing location
    }
    dispatch(fetchProducts({ token: authData?.token }))
      .then((data) => {
        // setLoading(false);
      })
      .catch(() => {
        // setLoading(false);
      });
      // console.log(userShoppingBag);
      // console.log(localStorage.getItem("userId"))
      let userId = localStorage.getItem("userId")
      let token = localStorage.getItem("token")
      dispatch(profileApiByUserId({userId: userId,token: token})).then((data) =>{
        // console.log(userId,token)
        setUser(data.payload);
        if(data.payload.id){
        dispatch(userShoppingBagByUserId({id:userId, token: token })).then((data) =>{
          // eslint-disable-next-line no-const-assign
          setUserShoppingBag(data.payload);
          setProductCount(data.payload.length)
        });
      }
      })
      // if(user){
      //   console.log(user?.id)
        
        // console.log(userShoppingBag)
      // }
   
   
  }, [dispatch, location]);

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    // navigate("/login");
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const goToShopping = () => {
    navigate("/user/shopping");
  };
  const goToMyProfile = () =>{
    setAnchorEl(null);
    handleMobileMenuClose();
    navigate("/user/profile")
  }
  const goToMyOrders = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    navigate("/user/order")
  }
  const goToLogin = () => {
    localStorage.clear();
    localStorage.setItem("isLoggedIn",false);
   
    navigate("/login")
  }
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={goToMyProfile}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={goToMyOrders}>My Orders</MenuItem>
      <MenuItem onClick={goToLogin}>Logout</MenuItem>
    </Menu>
  );
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
            onClick={goToShopping}
          >
            Agro Ecommerce
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <div className=" flex">
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton> &nbsp;
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              onClick={() => navigate("/user/shopping-bag")}
            >
              <Badge badgeContent={productCount} color="error">
                <ShoppingBagIcon />
              </Badge>
            </IconButton> &nbsp;
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />&nbsp;
              <label style={{"fontSize":"18px"}}>{user?.username}</label>
            </IconButton> 
            </div>
           
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
        {/* {renderMobileMenu} */}
      </AppBar>
      {renderMenu}
    </>
  );
}
export default UserAppHeader;
