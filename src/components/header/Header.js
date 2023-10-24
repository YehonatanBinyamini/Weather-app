import React from "react";
import "./header.css";
//import logo from "../../assets/images/white-logo.png";
import { /*Link,*/ NavLink } from "react-router-dom";

function Header(props) {
  
  return (
    <header className="header">
      <div className="connect-header">
        <label className="userName-header">Welcome!</label>
      </div>
      <nav className="nav">
        <NavLink to="./favorites">Favorites</NavLink>
        <NavLink to="./">Home</NavLink>
      </nav>
      {/* <div className="logo-container">
      <Link to="./">
        <img className="logo" src={logo} alt="logo" />
      </Link>
    </div> */}
    </header>
  );
}

export default Header;
