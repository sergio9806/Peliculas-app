import React, { useState } from 'react'
import Uno from '../image/imagen1.webp'
import Dos from '../image/imagen2.jpg'
import Tres from '../image/imagen3.png'
import { useNavigate } from 'react-router-dom';
import firebaseapp from '../credenciales'
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword} from 'firebase/auth'
const auth = getAuth(firebaseapp)

const Log = () => {
  
  const [registro, setRegistro] = useState(false)
  const navigate = useNavigate();
  const handlerSubmit = async(e)=>{
    e.preventDefault();
    const correo = e.target.email.value;
    const contraseña = e.target.password.value;

    if(registro){
        await createUserWithEmailAndPassword(auth, correo, contraseña)
        
    }
    else{
        await signInWithEmailAndPassword(auth, correo, contraseña)
        navigate("/Principal");
    }
}

    return(
      
      <div className='row container p-4'>
        <div className="col-md-8">
          <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={Uno} alt=""  className='tamaño-imagen'/>
              </div>
              <div className="carousel-item">
                <img src={Dos} alt="" className='tamaño-imagen'/>
              </div>
              <div class="carousel-item">
                <img src={Tres} alt="" className='tamaño-imagen'/>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>

        </div>
        {/* En esta seccion va el formulario  */}
        <div className="col-md-4">
          <div className='mt-5 ms-5'>
              <h1>{registro ? 'Registrate': 'Inicia sesion'}</h1>
              <form onSubmit={handlerSubmit}>
                <div className='mb-3'>
                  <label className='form-label'>Correo electronico</label>
                  <input type="email" className='form-control' placeholder='Ingresar email' id='email' reqired/>
                </div>
                <div className='mb-3'>
                  <label className='form-label'>Contraseña</label>
                  <input type="password" className='form-control' placeholder='Ingresar contraseña' id='password' required/>
                </div>
                <button className='btn btn-primary' type='submit' >
                {registro ? 'registrate': 'inicia sesion'}
                </button>
              </form>
           <div className='form-group'>
            <button className='btn btn-secondary mt-4 form-control' onClick={()=> setRegistro(!registro)}>
              {registro ? 'Ya tienes una cuenta? inicia sesión' : 'No tienes cuenta? registrate'}
              </button>
           </div>
            
          </div>
        </div>
      </div>
    )
}
export default Log