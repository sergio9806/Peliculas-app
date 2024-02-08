import React from 'react';
import {Link} from "react-router-dom";
import "./css/navbar2.css"





const Navegar2 = () => {
 
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container-fluid">
    <div className="collapse navbar-collapse" id="navbarNavDropdown">
      <ul className="navbar-nav">
      <li className="nav-item">
      <Link className="navbar__titulo" to='/'>MovieWorld </Link>
      </li>
      <li className="nav-item">
          <Link className="nav-link" to='/Inicio'>Inicio</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to='/Login'>Login</Link>
        </li>
      </ul>

    </div>
  </div>
</nav>
  )

}

export default Navegar2