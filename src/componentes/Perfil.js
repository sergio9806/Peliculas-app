import React, { useState } from "react";

import './css/perfil.css';

const Perfil = () => {
  const datosEmpresa = {
    nombre: "MovieWorld",
    industria: "Cine",
    telefono: "123-456-7890",
    descripcion: "Pagina para ver trailers de las mejores y mas actuales peliculas",

  };


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí podrías enviar los datos a tu servidor o hacer lo que necesites con ellos
    console.log('Nombre:', name);
    console.log('Correo:', email);
    console.log('Teléfono:', phone);
    console.log('Comentario:', comment);

  };

  return (

    <div className="bodyPerfil">
      <div className="tittlePerfil">
        <h1 >MovieWorld</h1>
      </div>
      <div className="perfil__container">
        <div className="perfil__cuadro">
          <h1>Perfil Empresarial</h1>
          <p><strong>Nombre:</strong> {datosEmpresa.nombre}</p>
          <p><strong>Industria:</strong> {datosEmpresa.industria}</p>
          <p><strong>Descripción:</strong> {datosEmpresa.descripcion}</p>
          <p><strong>Contacto:</strong> {datosEmpresa.telefono}</p>
        </div>
      </div>

      <div className="perfil__containerBuzon">
        <div className="perfil__buzon">
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Nombre:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
            </div>
            <div>
              <label>
                Correo:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
            </div>
            <div>
              <label>
                Teléfono:
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
            </div>
            <div>
              <label>
                Comentario:
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
              </label>
            </div>
            <button type="submit">Enviar comentario</button>
          </form>
        </div>
      </div>
       <div class="night">
        <div className="shooting_star"></div>
        <div className="shooting_star"></div>
        <div className="shooting_star"></div>
        <div className="shooting_star"></div>
        <div className="shooting_star"></div>
        <div className="shooting_star"></div>
        <div className="shooting_star"></div>
        <div className="shooting_star"></div>
        <div className="shooting_star"></div>
        <div className="shooting_star"></div>
        <div className="shooting_star"></div>
        <div className="shooting_star"></div>
        <div className="shooting_star"></div>
        <div className="shooting_star"></div>
        <div className="shooting_star"></div>
        <div className="shooting_star"></div>
        <div className="shooting_star"></div>
        <div className="shooting_star"></div>
      </div> 
    </div>
  );
};

export default Perfil;