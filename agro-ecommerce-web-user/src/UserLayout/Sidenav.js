import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
// import ims from "/images/ims.png";

const AppHeaderUserSidebar = ({ displayName }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let isLogin = localStorage.getItem("isLoggedIn");
    if (isLogin === 'true') {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    console.log(isLoggedIn)
  },[localStorage,isLoggedIn]);
  const [navList] = useState([
    {
      name: "Dashboard",
      link: "/user/dashboard",
      logo: "fas fa-home",
    },
    {
      name: "Order",
      link: "/user/order",
      logo: "fas fa-shopping-cart",
    },

    
  ]);

  return (
    <div className="col-lg-2 col-md-4 sidebar fixed-top">
      <a
        href="/"
        className="navbar-brand text-white d-block mx-auto 
                                text-center py-3 mb-4 bottom-border app-sidebar-logo bottom-border"
      >
        <img src={require("../ims.png")} alt="ims" />
        <span className="side-bar-font-brand">IMS</span>
      </a>
      {isLoggedIn && (
        <div>
          <div className="bottom-border pb-3 text-white d-block mx-auto text-center side-bar-font">
            Hi {displayName ? displayName.substr(0, 15) : "User"}
          </div>
          <ul className="navbar-nav flex-column mt-3">
            {navList &&
              navList.map((nav) => (
                <li className="nav-item" key={nav.name}>
                  <NavLink
                    to={nav.link}
                    className="nav-link text-white p-3 mb-2 sidebar-link"
                  >
                    <i className={"text-light fa-lg mr-3 " + nav.logo}></i>
                    &nbsp;&nbsp;
                    {nav.name}
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AppHeaderUserSidebar;
