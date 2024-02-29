import React, { useState } from 'react';
import './App.css';
import Home from './componentes/Home'
import Login from './componentes/Login';
import Navegar from './componentes/NavBar';
import Principal from "./componentes/Principal";
import Perfil from './componentes/Perfil';
import Detalle from "./componentes/Detalle";
import firebaseapp from './credenciales';
import Inicio from './componentes/Inicio';
import Navegar2 from './componentes/Navegar2'; 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Route, Routes, BrowserRouter} from "react-router-dom";

const auth = getAuth(firebaseapp)

function App() {
   
  const [Usuario, setUsuario] = useState(null)
 


  
  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase) {
      setUsuario(usuarioFirebase)
      
    }
    else {
      setUsuario(null)
    }
  })
  return (

    <div className="main">
      
      {Usuario ? (
        <BrowserRouter>
          <Navegar correoUsuario={Usuario.email} />
          <Routes>
            <Route path='/' element={<Principal usuario={Usuario}  />} />
            <Route path='/Principal' element={<Principal  usuario={Usuario}  />} />
            <Route path='/Home' element={<Home  />} />
            <Route path='/Perfil' element={<Perfil  />} />
            <Route path='/Detalle/:movieId' element={<Detalle  />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <BrowserRouter>
        <Navegar2 />  
          <Routes>    
          <Route path='/' element={<Inicio />}/>
          <Route path='/Inicio' element={<Inicio />}/>
          <Route path='/Login' element={<Login />} />
          </Routes>
        </BrowserRouter>
       
      )}


    </div>
  );
}

export default App;
