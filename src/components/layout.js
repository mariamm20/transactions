import React from "react";
import { Link } from "react-router-dom";
import { HouseFill, PeopleFill } from 'react-bootstrap-icons';

export function Navbar(){
    return (
        <nav className="navbar navbar-expand-lg navbar-light  py-lg-2 my-lg-3  flex-column">
  <div className="container flex-column  align-items-baseline">
    
    <Link className="navbar-brand mb-3" to="/">
    <img src="logo-no-background.png" alt="" width={"250"} className="d-inline-block align-text-top"/>
    </Link>
    {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button> */}
    <div className="w-100" id="navbarSupportedContent">
      <ul className="navbar-nav flex-row flex-lg-column w-100 justify-content-between">
        <li className="nav-item mb-3">
          <Link className="nav-link text-dark fw-bold d-flex align-items-center gap-3 " aria-current="page" to="/">
          <HouseFill color="Black" size={16} />
          <p className="p-0 m-0">Home</p>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-dark fw-bold d-flex align-items-center gap-3" to="/customers">
          <PeopleFill color="black" size={16} />
          <p className="p-0 m-0">Customers</p>
          </Link>
        </li>
        
      </ul>

    </div>
  </div>
</nav>
    );
}


export function Footer(){
    return(
        <footer>
            <div className="container p-3 mt-5">
                <small className="text-muted text-center d-block">© 2023 Company, Inc</small>
            </div>
        </footer>
    );
}