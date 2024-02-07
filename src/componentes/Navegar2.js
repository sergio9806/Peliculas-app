import React from 'react';
import {Link} from "react-router-dom";




const Navegar2 = () => {
 
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container-fluid">
    <a className="navbar-brand" >MovieWorld </a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNavDropdown">
      <ul className="navbar-nav">
      
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