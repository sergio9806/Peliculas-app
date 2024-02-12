import React from 'react';
import { Link } from "react-router-dom";
import "./css/navbar2.css"
import { mostrar_menu} from "./Inicio";




const Navegar2 = () => {

  return (
    <div className="Navbar2__container">
      <nav className="navbar2__nav">
        <ul className="navbar2__ul">
        <a className="titulo__Pagina2">MovieWorld</a>
          <li className="item__nav2">
            <Link className="Nvitem2" to='/Inicio'>Inicio</Link>
          </li>
          <li className="item__nav2">
            <Link className="Nvitem2" to='/Login'>Login</Link>
          </li>
          <span></span>
        </ul> 
      </nav>
     
    </div>

  )

}

export default Navegar2