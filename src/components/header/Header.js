import React from "react";
import "./header.css";
import logo from "../../assets/images/logo.png";
import { Link, NavLink } from "react-router-dom";

function Header(props) {
  return (
    <header className="header">
      <div className="logo-container">
      <Link to="./">
        <img className="logo" src={logo} alt="logo" />
      </Link>
      <nav className="nav">
        <NavLink to="./">Home</NavLink>
        <NavLink to="./favorites">Favorites</NavLink>
      </nav>
    </div>
      <div>
        <label className="text-header">Welcome!</label>
      </div>
    </header>
  );
}

export default Header;
