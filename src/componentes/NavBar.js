import React from "react";
import {Link, useNavigate} from "react-router-dom";
import firebaseapp from "../credenciales";
import {getAuth,signOut} from "firebase/auth";
import "./css/navbar.css";




const auth = getAuth(firebaseapp)



export const NavBar = ({correoUsuario}) => {
  const navigate = useNavigate();
  const navegar = ()=> {
    
    navigate("/Inicio");
  }
  return (
    <div className="Navbar__container">
    <nav className="navbar__nav">
  
    {/* <a className="navbar-brand" >MovieWorld</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button> */}
       
      <ul className="navbar__ul">
      <a className="titulo__Pagina">MovieWorld</a>
      <li className="item__nav">
          <Link className="Nvitem" to='/Principal'>Mi espacio</Link>
        </li>

        <li className="item__nav">
          <Link className="Nvitem" aria-current="page" to='/Home' >Cartelera</Link>
        </li>
        <li className="item__nav">
          <Link className="Nvitem" to='/Perfil'>Perfil</Link>
        </li>
        
        <span></span>

        {/* <li className="nav-item">
          <Link className="nav-link" to='/Detalle'></Link>
        </li> */}
         {/* <a className="bienvenido"> Bienvenido, <strong>{correoUsuario}</strong> haz iniciado sesión </a> */}
      </ul>
      <button className="boton__SignOut">
      <span  onClick={()=> navegar(signOut(auth))}>Cerrar sesión</span>
       </button>
</nav>

</div>
  )
}

export default NavBar