import React from "react";
import "./header.css";
import logo from "../../assets/images/logo.png";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUnits } from "../../store/unitsReducer";

function Header(props) {
  const units = useSelector((state) => state.units);
  const dispatch = useDispatch();

  const handleUnitChange = () => {
    const newUnits = units === "F" ? "C" : "F";
    dispatch(setUnits(newUnits));
  };

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="./">
          <img className="logo" src={logo} alt="logo" />
        </Link>
        <nav className="nav">
          <NavLink to="./">Home</NavLink>
          <NavLink to="./favorites">Favorites</NavLink>
          <label className="nav-link" onClick={handleUnitChange}>Switch Units</label>
        </nav>
      </div>
      <div>
        <label className="text-header">Welcome!</label>
      </div>
    </header>
  );
}

export default Header;
