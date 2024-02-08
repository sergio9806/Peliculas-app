import React from "react";
import {Link, useNavigate} from "react-router-dom";
import firebaseapp from "../credenciales";
import {getAuth,signOut} from "firebase/auth";




const auth = getAuth(firebaseapp)



export const NavBar = ({correoUsuario}) => {
  const navigate = useNavigate();
  const navegar = ()=> {
    
    navigate("/Inicio");
  }
  return (
    
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container-fluid">
    <a className="navbar-brand" >MovieWorld</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNavDropdown">
      <ul className="navbar-nav">

      <li className="nav-item">
          <Link className="nav-link" to='/Principal'>Mi espacio</Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to='/Home' >Cartelera</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to='/Perfil'>Perfil</Link>
        </li>

        {/* <li className="nav-item">
          <Link className="nav-link" to='/Detalle'></Link>
        </li> */}
         <a className="bienvenido"> Bienvenido, <strong>{correoUsuario}</strong> haz iniciado sesión </a>
      </ul>
      <button className='btn btn-info mb-6 mt-2 ' onClick={()=> navegar(signOut(auth))}>Cerrar sesión</button>
    </div>
  </div>
</nav>
  )
}

export default NavBar