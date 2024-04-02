import React from 'react';
import { Link } from "react-router-dom";
import "./css/navbar2.css"
import { mostrar_menu} from "./Inicio";
import logo_n from "../image/palomitasneon.png";




const Navegar2 = () => {

  return (
    <div className="Navbar2__container">
      <nav className="navbar2__nav">
        
        <ul className="navbar2__ul">
        <div className="logo__navbar"><img src={logo_n} alt="" className='tamaño__logoN' /><p className="titulo__Pagina">MovieWorld</p></div>
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