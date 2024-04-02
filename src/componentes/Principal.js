import Portada from '../image/pantalla_cine2.jpg'
import logo from "../image/palomitasneon.png";
import "./css/Principal.css"
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import styled from "styled-components";
import Modal from './Modal';
import Modal2 from './modal2';
import Modal3 from './Modal3';
import Modal4 from './modal4';
import firebaseapp from "../credenciales";
import { getFirestore, collection, addDoc, getDoc, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

const db = getFirestore(firebaseapp);
const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;
const URL_IMAGE = process.env.REACT_APP_URL_IMAGE;

const Principal = ({ usuario }) => {
  //variables de estado 

  //para recuperar los datos especificos de la lista 
  const [ObtId, setObtId] = useState('');
  const [subId, setsubId] = useState('');
  const [lista, setLista] = useState([]);
  const [ListaVista, setListaVista] = useState([]);
  const [ListaCali, setListaCali] = useState([])
  //datos de la tabla usuarios
  const [user, setUser] = useState({
    Nombre: '',
    Idpelicula: '',
    correo: '',
    urlima: '',
    descrip_movie: ''
  });
  //datos de la tabla de vistas 
  const [userVista, setUserVista] = useState({
    Nombre: '',
    Idpelicula: '',
    correo: '',
    urlima: '',
    descrip_movie: ''
  });
  //datos tabla de calificaciones
  const [userCalificacion, setUserCalificacion] = useState({
    nombrePeli: '',
    Idpelicula: '',
    correo: '',
    calificacion: '',
    comentario: ''
  });
  const [Window1, Windowstate] = useState(false);
  const [Window1vista, Windowstatevista] = useState(false);
  const [Window1calificacion, Windowstatecalificacion] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [movie, setMovie] = useState({ title: "loading page" });
  const [cast, setCast] = useState([]);
  //variables para carousel
  const filas = document.querySelector('.container__carousel3');
  const flechaIzquierda2 = document.getElementById('flecha__izquierda3');
  const flechaDerecha2 = document.getElementById('flecha__derecha3');
  //variables generales 
  const contenedorPeliculasRef = useRef(null);
  //capturar los datos de la tabla usuarios 
  const capturardatos = () => {
    setUser({
      Nombre: movie.title,
      Idpelicula: movie.id,
      correo: usuario.email,
      urlima: URL_IMAGE + movie.poster_path,
      descrip_movie: movie.overview
    });
  }
  //capturar los datos de la tabla vistas 
  const capturardatosVistas = (datosCarousel) => {
    setUserVista({
      Nombre: datosCarousel.Nombre,
      Idpelicula: datosCarousel.Idpelicula,
      correo: datosCarousel.correo,
      urlima: datosCarousel.urlima,
      descrip_movie: datosCarousel.overview
    });
  }
  //capturar los datos de la tabla calificaciones
  const capturardatosCalificaciones = (datosCalificaciones) => {
    setUserCalificacion({
      Nombre: datosCalificaciones.Nombre,
      Idpelicula: datosCalificaciones.Idpelicula,
      correo: datosCalificaciones.correo,
      calificacion: datosCalificaciones.calificacion,
      comentario: datosCalificaciones.comentario
    });
  }
  //constantes para mostrar u ocultar las categoias de las calificaciones 
  const [mostrarDetails, setMostrarDetails] = useState(null);
  const [mostrarMuyMalas, setMostrarMuyMalas] = useState(false);
  const [mostrarRegular, setMostrarRegular] = useState(false);
  const [mostrarBuenas, setMostrarBuenas] = useState(false);
  const [mostrarMuyBuenas, setMostrarMuyBuenas] = useState(false);
  const [mostrarExcelente, setMostrarExcelente] = useState(false);
  //funcion para guardar los datos  en la bd usuarios
  const guardarDatos = async (e) => {
    e.preventDefault();
    try {
      if (subId === '') {
        await addDoc(collection(db, 'usuarios'), { ...user });
      } else {
        await setDoc(doc(db, 'usuarios', subId), { ...user });
      }
      setUser({ Nombre: '', Idpelicula: '', correo: '', urlima: '', descrip_movie: '' });
      setsubId('');
      Windowstate(false);
      getLista();
    } catch (error) {
      console.log(error);
    }
  };

  //funcion para guardar los datos  en la bd vistas
  const guardarDatosVistas = async (e, datosPelicula, props) => {
    e.preventDefault();
    try {
      if (subId === '') {
        await addDoc(collection(db, 'vistas'), { ...datosPelicula });
      } else {
        await setDoc(doc(db, 'vistas', subId), { ...datosPelicula });
      }
      setUser({ Nombre: '', Idpelicula: '', correo: '', urlima: '', descrip_movie: '' });
      setsubId('');
      Windowstatevista(false);
      getListavista();
    } catch (error) {
      console.log(error);
    }
  }
  //funcion para guardar los datos  en la bd calificaciones 
  const guardarDatosCalificaciones = async (e, list) => {
    e.preventDefault();
    try {
      const calificacionData = {
        Nombre__calificacion: list.Nombre,
        Idpelicula__calificacion: list.Idpelicula,
        correo__calificacion: list.correo,
        calificacion: userCalificacion.calificacion,
        comentario_personal: userCalificacion.comentario
      };

      await addDoc(collection(db, 'calificaciones'), calificacionData);
      Windowstatecalificacion(false);
      setMostrarDetails(false);
      setUserCalificacion({
        nombrePeli: '',
        Idpelicula: '',
        correo: '',
        calificacion: '',  // Restablecer el valor del select
        comentario: ''
      });
      getListaCali();
    } catch (error) {
      console.error("Error al guardar la calificación:", error);
    }
  };


  //evento listener para flecha derecha
  const fechtIndicadores = () => {
    if (flechaDerecha2 !== null) {
      flechaDerecha2.addEventListener('click', () => {
        filas.scrollLeft += filas.offsetWidth;
      });
    }

    if (flechaIzquierda2 !== null) {
      flechaIzquierda2.addEventListener('click', () => {
        filas.scrollLeft -= filas.offsetWidth;
      });
    }
  }
  //useeffect posicionarse en la primera película
  useEffect(() => {
    if (contenedorPeliculasRef.current) {
      const primeraPelicula = contenedorPeliculasRef.current.querySelector('.col-md-4');
      if (primeraPelicula) {
        const rect = primeraPelicula.getBoundingClientRect();
        console.log("Coordenadas de la primera película:", rect.left, rect.top);
      }
    }

    fetchMovies();

  }, []);


  // funcion para realizar la peticion get a la api
  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });
    setMovies(results);
    setMovie(results[0]);

    if (results.length) {
      await fetchMovie(results[0].id);
    }

  };

  // funcion para la peticion de un solo objeto 
  const fetchMovie = async (id) => {
    const response = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "credits",
      },
    });
    setMovie(response.data);
    setCast(response.data.credits.cast); // Establecer el elenco en el estado
  };

  //funcion para seleccionar pelicula
  const selectMovie = async (movie) => {
    fetchMovie(movie.id);
    setMovie(movie);
  };

  // funcion para buscar peliculas
  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };
  //obtener lista usuarios
  const getLista = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'usuarios'));
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setLista(docs);
    } catch (error) {
      console.error(error);
    }
  }, [setLista, db]);
  // Función para obtener la lista de vistas
  const getListavista = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'vistas'));
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setListaVista(docs);
    } catch (error) {
      console.error(error);
    }
  }, [setListaVista, db]);
  // Función para obtener la lista de calificaciones
  const getListaCali = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'calificaciones'));
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setListaCali(docs);
    } catch (error) {
      console.error(error);
    }
  }, [setListaCali, db]);

  //llamadas de las funciones
  useEffect(() => {
    getLista();
    getListavista();
    getListaCali();
  }, [getLista, getListavista, getListaCali]);

  //funcion para eliminar películas de la tabla usuarios 
  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, 'usuarios', id));
      setLista(prevLista => prevLista.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar la película:", error);
    }
  }
  //funcion para eliminar películas de la tabla vistas 
  const deleteUserVistas = async (id) => {
    try {
      await deleteDoc(doc(db, 'vistas', id))
      setListaVista(prevLista => prevLista.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar la película:", error);
    }
  }
  const deleteUserCalificaciones = async (id) => {
    try {
      await deleteDoc(doc(db, 'calificaciones', id))
      setListaCali(prevLista => prevLista.filter(item => item.id !== id));
      getListaCali();
    } catch (error) {
      console.error("Error al eliminar la película:", error);
    }
  }

  const toggleDetails = (id) => {
    setMostrarDetails(id === mostrarDetails ? null : id);
  };
  const toggleDetailspelicula = (id) => {
    Windowstatevista(lista.find(item => item.id === id));
  };

  const getOne = useCallback(async (id) => {
    try {
      const docRef = doc(db, 'calificaciones', id);
      const docSnap = await getDoc(docRef);
      setUserCalificacion(docSnap.data());
      setModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  }, [db, setModalOpen, setUserCalificacion]);
  const handleEditarItem = (item) => {
    setEditarItem(item);
    setMostrarVentanaEdicion(true);
  };
  const [editarItem, setEditarItem] = useState(null);
  const [mostrarVentanaEdicion, setMostrarVentanaEdicion] = useState(false);
  const [mostrarVentanaEdicion2, setMostrarVentanaEdicion2] = useState(false);
  const [mostrarVentanaEdicion3, setMostrarVentanaEdicion3] = useState(false);
  const [mostrarVentanaEdicion4, setMostrarVentanaEdicion4] = useState(false);
  const [mostrarVentanaEdicion5, setMostrarVentanaEdicion5] = useState(false);
  // Función para guardar los cambios después de la edición
  const guardarCambios = (nuevosDatos) => {
    // Aquí deberías implementar la lógica para actualizar los datos en tu lista o base de datos
    console.log("Guardando cambios:", nuevosDatos);
    setMostrarVentanaEdicion(false);
    setMostrarVentanaEdicion2(false);
    setMostrarVentanaEdicion3(false);
    setMostrarVentanaEdicion4(false);
    setMostrarVentanaEdicion5(false);
    // Además, puedes actualizar tu lista de datos si es necesario
    // Ejemplo: setListaCali(nuevaListaCali);
  };

  return (

    <main className='main__Principal'>

      <section className='banner__animacion'>
        <img src={Portada} alt="" className='tamaño__imagen' height={800} />
        <section className="bodyp">
          <article className='logo__cine'><img src={logo} alt="" className='tamaño__logo' /></article>
          <div className='titulo__movimiento'><span className='titulo__animado'>MovieWorld</span></div>
        </section>
      </section>
      <section>
        <form className="buscador__Principal" onSubmit={searchMovies}>
          <input className="buscador__barraP" type='text' placeholder='search' onChange={(e) => setSearchKey(e.target.value)} />
          <button className="buscador__botonP">Buscar</button>
        </form>
      </section>
      <section className='contenedor__Principal'>
        <section className='lado1'>

          {/* contenedor de poster de peliculas */}
          <section className='container__peliculas3'>

            <div className="container__principal3">
              <button id='flecha__izquierda3' className="flecha__izquierda3"> {'<'}</button>
              <div className="container__carousel3">
                <div className="carousel3" ref={fechtIndicadores}>
                  {movies.map((movie) => (
                    <div key={movie.id} className="Opciones__peliculas3" onClick={() => selectMovie(movie)}>
                      <img src={`${URL_IMAGE + movie.poster_path}`} alt="" />
                    </div>
                  ))}
                </div>
              </div>
              <button id='flecha__derecha3' className="flecha__derecha3">{'>'}</button>
            </div>
          </section>
        </section>
        <section className='lado2'>
          <div className='title__button'>
            <h1 className="text_movie">{movie.title}</h1>
            <button className='botton__movie'>
              <span onClick={() => Windowstate(true)} >Agregar película</span>
            </button>
          </div>
          <div className='stats'>
            <h2>{movie.release_date}</h2>
            <h2 className='text__vote'>Votos: {movie.vote_count}</h2>
          </div>
          <p className="text__overview">{movie.overview}</p>
          {/* Renderizar la información del elenco */}
          <div className="cast__listPrincipal">
            <h3>Elenco:</h3>
            <p>{cast.map(actor => actor.name).join(", ")}</p>
          </div>
        </section>
      </section>
      <Modal
        estado={Window1}
        cambiarEstado={Windowstate}
      >
        <Opciones>
          <Opciones2>
            <form onSubmit={guardarDatos}>
              <h1 name='Nombre' >{movie.title}</h1>
              <p name='Idpelicula' className='id-pelicula'>{movie.id}</p>
              <p name='correo' className='correo-info'>{usuario.email}</p>
              <p name='urlima' className='urlFavImagen'>${URL_IMAGE + movie.poster_path}</p>
              <p name='descrip_movie' className='descrip_moviebd'>{movie.overview}</p>
              <h2>¿Deseas agregar esta película a favoritos?</h2>
              <button onClick={capturardatos}>Agregar</button>
            </form>
          </Opciones2>
          <Opciones3>
            <div key={movie.id}>

              <img src={`${URL_IMAGE + movie.poster_path}`} alt="" width={110} height={150} />
            </div>
          </Opciones3>
        </Opciones>
      </Modal>

      {/* carrusel de peliculas por ver  */}
      <div className='card__fav'>
        <h1>Películas por ver</h1>
        <div className='Carousel__FavoritesContainer'>
          {
            lista
              .filter(list => list.correo === usuario.email)
              .map(list => (
                <div key={list.id} className='Carousel__Favorites1C'>
                  <div key={list.Idpelicula} className='Carousel__Favorites1'>
                    <div className='imgbox'>
                      <img className='img__carFav' src={list.urlima} alt="" onClick={() => toggleDetails(list.id)} />
                    </div>
                    {mostrarDetails === list.id && (
                      <div className='details__PorVer'>
                        <h1 className='details__titulo'>{list.Nombre}</h1>
                        <section className='btnmovie'>
                          <button className='movie__vista' onClick={() => toggleDetailspelicula(list.id)} >Película vista</button>
                        </section>
                        <button className='btn__deleteMovie' onClick={() => deleteUser(list.id)}>
                          Eliminar película
                        </button>
                        <Modal2
                          estadovista={Window1vista}
                          cambiarEstadovista={Windowstatevista}
                          capturardatosVistas={capturardatosVistas}
                          datosPelicula={list.id}
                          detallesAbiertos={mostrarDetails === list.id ? list : null}
                        >
                          <Opcionesfav>
                            <Opciones2fav>
                              <form onSubmit={(e) => guardarDatosVistas(e, list)}>
                                <h1 name='Nombre_vista' >{list.Nombre}</h1>
                                <p name='Idpelicula_vista' className='id-pelicula2'>{list.Idpelicula}</p>
                                <p name='correo_vista' className='correo-info2'>{list.correo}</p>
                                <p name='urlima_vista' className='urlFavImagen2'>${list.urlima}</p>
                                <p name='descrip_movie_vista' className='descrip_moviebd2'>{list.overview}</p>
                                <h2>¿Deseas agregar esta película a peliculas vistas?</h2>
                                <button onClick={(e) => guardarDatosVistas(e, list, deleteUser(list.id))}>Agregar</button>


                              </form>

                            </Opciones2fav>
                            <Opciones3fav>
                              <div key={movie.id}>

                                <img src={`${list.urlima}`} alt="" width={110} height={150} />
                              </div>
                            </Opciones3fav>
                          </Opcionesfav>

                        </Modal2>
                      </div>

                    )}
                  </div>
                  <hr />
                </div>

              ))
          }

        </div>
      </div>

      {/* carrusel de peliculas vistas  */}
      <div className='card__fav2'>
        <h1>Películas vistas</h1>
        <div className='Carousel__FavoritesContainer2C'>
          {
            ListaVista
              .filter(list => list.correo === usuario.email)
              .map(list => (
                <div key={list.id} className='Carousel__Favorites2C'>
                  <div key={list.Idpelicula} className='Carousel__Favorites2'>
                    <div className='imgbox1'>
                      <img className='img__carFav1' src={list.urlima} alt="" onClick={() => toggleDetails(list.id)} />
                    </div>
                    {mostrarDetails === list.id && (
                      <div className='details'>
                        <h1>{list.Nombre}</h1>
                        <section className='btnmovie'>
                          <button className='movie__vista' onClick={() => Windowstatecalificacion(true)} >Calificar</button>
                        </section>
                        <button className='btn__deleteMovie' onClick={() => deleteUserVistas(list.id)}>
                          Eliminar película
                        </button>
                        <Modal3
                          estadocalificacion={Window1calificacion}
                          cambiarEstadocalificacion={Windowstatecalificacion}
                          capturardatosCalificaciones={capturardatosCalificaciones}
                          datosPeliculacali={list}
                          detallesAbiertos={mostrarDetails === list.id ? list : null}
                        >
                          <Opciones>
                            <OpcionesCali>
                              <form onSubmit={(e) => guardarDatosCalificaciones(e, list)}>
                                <h1 name='Nombre__calificacion' className='nombre__calificacion'>{list.Nombre}</h1>
                                <p name='Idpelicula__calificacion' className='id__pelicula__cali'>{list.Idpelicula}</p>
                                <p name='correo__calificacion' className='correo__cali'>{list.correo}</p>
                                <h3>Califica la película</h3>
                                <select name='calificacion' className='select__calificacion' value={userCalificacion.calificacion} onChange={(e) => setUserCalificacion({ ...userCalificacion, calificacion: e.target.value })}>
                                  <option></option>
                                  <option>Mala</option>
                                  <option>Regular</option>
                                  <option>Buena</option>
                                  <option>Muy buena</option>
                                  <option>Excelente</option>
                                </select>
                                <input name='comentario_personal'
                                  className='comentario_personal'
                                  placeholder="Añade un comentario sobre la película"
                                  value={userCalificacion.comentario}
                                  onChange={(e) => setUserCalificacion({ ...userCalificacion, comentario: e.target.value })} />
                                <h2>¿Enviar calificación?</h2>
                                <button type="submit" >Enviar</button>
                              </form>
                            </OpcionesCali>
                            <Opciones3Cali>
                              <div key={list.id}>
                                <img src={`${list.urlima}`} alt="" width={120} height={180} />
                              </div>
                            </Opciones3Cali>
                          </Opciones>
                        </Modal3>
                      </div>
                    )}
                  </div>
                  <hr />
                </div>
              ))
          }
        </div>
      </div>


      {/* valoracion de peliculas  */}

      <div className='div__calificaciones'>
        <h1>Valoración de películas </h1>
        <div className='calificaciones'>
          <button className='card' onClick={() => setMostrarMuyMalas(!mostrarMuyMalas)}>
            <span className='card__body'>Muy malas</span>
          </button>
          <button className='card' onClick={() => setMostrarRegular(!mostrarRegular)}>
            <span className='card__body'>Regular</span>
          </button>
          <button className='card' onClick={() => setMostrarBuenas(!mostrarBuenas)}>
            <span className='card__body' >Buena</span>
          </button>
          <button className='card' onClick={() => setMostrarMuyBuenas(!mostrarMuyBuenas)}>
            <span className='card__body'>Muy buena</span>
          </button>
          <button className='card' onClick={() => setMostrarExcelente(!mostrarExcelente)}>
            <span className='card__body'>Excelente</span>
          </button>
        </div>

        <div className='Calificaciones__tables'>



          <section>
          <div>
      {mostrarVentanaEdicion && (
        <div className="ventana__edicion">
          <h2>Editar información</h2>
          <section>
          <input type="text" defaultValue={editarItem?.Nombre__calificacion} />
          <input type="text" defaultValue={editarItem?.comentario_personal} />
          <button onClick={() => guardarCambios({ id: editarItem.id, nuevoNombre: 'nuevo valor', nuevoComentario: 'nuevo comentario' })}>Guardar cambios</button>
        </section>
        </div>
      )}
      {mostrarMuyMalas && (
        <div className="container_tables">
          <h1>Películas con calificación mala</h1>
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Calificación</th>
                <th>Comentario</th>
              </tr>
            </thead>
            <tbody>
              {ListaCali.filter(list => list.calificacion === 'Mala' && list.Nombre__calificacion && list.comentario_personal).map((list, index) => (
                <tr key={index}>
                  <td data-label="Nombre">{list.Nombre__calificacion}</td>
                  <td data-label="Calificación">{list.calificacion}</td>
                  <td data-label="Comentario">{list.comentario_personal}</td>
                  <td data-label="Operaciones">
                    <a onClick={() => handleEditarItem(list)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                      </svg>
                    </a>
                    <a onClick={() => deleteUserCalificaciones(list.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                      </svg>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

          </section>

          <section>
          <div>
      {mostrarVentanaEdicion2 && (
        <div className="ventana__edicion">
          <h2>Editar información</h2>
          <section>
          <input type="text" defaultValue={editarItem?.Nombre__calificacion} />
          <input type="text" defaultValue={editarItem?.comentario_personal} />
          <button onClick={() => guardarCambios({ id: editarItem.id, nuevoNombre: 'nuevo valor', nuevoComentario: 'nuevo comentario' })}>Guardar cambios</button>
        </section>
        </div>
      )}
            {mostrarRegular && (
              <div className='container_tables'>
                <h1>Películas con calificación regular</h1>
                <table className='tabla'>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Calificación</th>
                      <th>Comentario</th>
                      <th>Operaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ListaCali.filter(list => list.calificacion === 'Regular' && list.Nombre__calificacion && list.comentario_personal).map((list, index) => (
                      <tr key={index}>
                        <td data-label="Nombre">{list.Nombre__calificacion}</td>
                        <td data-label="Calificación">{list.calificacion}</td>
                        <td data-label="Comentario">{list.comentario_personal}</td>
                        <td data-label="Operaciones">
                          <a onClick={() => handleEditarItem(list)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                          </a>
                          <a onClick={() => deleteUserCalificaciones(list.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            </div>
          </section>
          <section>
          <div>
      {mostrarVentanaEdicion3 && (
        <div className="ventana__edicion">
          <h2>Editar información</h2>
          <section>
          <input type="text" defaultValue={editarItem?.Nombre__calificacion} />
          <input type="text" defaultValue={editarItem?.comentario_personal} />
          <button onClick={() => guardarCambios({ id: editarItem.id, nuevoNombre: 'nuevo valor', nuevoComentario: 'nuevo comentario' })}>Guardar cambios</button>
        </section>
        </div>
      )}
            {mostrarBuenas && (
              <div className='container_tables'>
                <h1>Películas con calificación buena</h1>
                <table className='tabla'>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Calificación</th>
                      <th>Comentario</th>
                      <th>Operaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ListaCali.filter(list => list.calificacion === 'Buena' && list.Nombre__calificacion && list.comentario_personal).map((list, index) => (
                      <tr key={index}>
                        <td data-label="Nombre">{list.Nombre__calificacion}</td>
                        <td data-label="Calificación">{list.calificacion}</td>
                        <td data-label="Comentario">{list.comentario_personal}</td>
                        <td data-label="Operaciones">
                          <a>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                          </a>
                          <a onClick={() => deleteUserCalificaciones(list.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            </div>
          </section>
          <section>
          <div>
      {mostrarVentanaEdicion4 && (
        <div className="ventana__edicion">
          <h2>Editar información</h2>
          <section>
          <input type="text" defaultValue={editarItem?.Nombre__calificacion} />
          <input type="text" defaultValue={editarItem?.comentario_personal} />
          <button onClick={() => guardarCambios({ id: editarItem.id, nuevoNombre: 'nuevo valor', nuevoComentario: 'nuevo comentario' })}>Guardar cambios</button>
        </section>
        </div>
      )}
            {mostrarMuyBuenas && (
              <div className='container_tables'>
                <h1>Películas con calificación muy buena</h1>
                <table className='tabla'>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Calificación</th>
                      <th>Comentario</th>
                      <th>Operaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ListaCali.filter(list => list.calificacion === 'Muy Buena' && list.Nombre__calificacion && list.comentario_personal).map((list, index) => (
                      <tr key={index}>
                        <td data-label="Nombre">{list.Nombre__calificacion}</td>
                        <td data-label="Calificación">{list.calificacion}</td>
                        <td data-label="Comentario">{list.comentario_personal}</td>
                        <td data-label="Operaciones">
                          <a>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                          </a>
                          <a onClick={() => deleteUserCalificaciones(list.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            </div>
          </section>
          <section>
          <div>
      {mostrarVentanaEdicion5 && (
        <div className="ventana__edicion">
          <h2>Editar información</h2>
          <section>
          <input type="text" defaultValue={editarItem?.Nombre__calificacion} />
          <input type="text" defaultValue={editarItem?.comentario_personal} />
          <button onClick={() => guardarCambios({ id: editarItem.id, nuevoNombre: 'nuevo valor', nuevoComentario: 'nuevo comentario' })}>Guardar cambios</button>
        </section>
        </div>
      )}
            {mostrarExcelente && (
              <div className='container_tables'>
                <h1>Películas con calificación excelente</h1>
                <table className='tabla'>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Calificación</th>
                      <th>Comentario</th>
                      <th>Operaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ListaCali.filter(list => list.calificacion === 'Excelente' && list.Nombre__calificacion && list.comentario_personal).map((list, index) => (
                      <tr key={index}>
                        <td data-label="Nombre">{list.Nombre__calificacion}</td>
                        <td data-label="Calificación">{list.calificacion}</td>
                        <td data-label="Comentario">{list.comentario_personal}</td>
                        <td data-label="Operaciones">
                          <a>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                          </a>
                          <a onClick={() => deleteUserCalificaciones(list.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Principal
//practica con styled components 
const Opciones = styled.div`
display:flex;
padding-right:4%;
`;
const Opciones2 = styled.div`
paddig-right:2%;
h1{
  font-size:35px;
}
h2{
  margin-top:20px;
  font-size:20px;
}
button{
  margin-top:20px;
  width:90px;
  heigth: 60px;
  background-color: rgb(35, 199, 35);
  border:none;
  font-style: bold;
  color:#fff;
  padding-bottom:6px;
}
button:hover{
  background-color: darkgreen;
  transition: 0.5s;
}
.correo-info{
  display: none;
}
.id-pelicula{
  display:none;
}
.urlFavImagen{
  display: none;
}
.descrip_moviebd{
  display:none;
}
`;

const Opciones3 = styled.div`

`;
const Opcionesfav = styled.div`
display:flex;
padding-right:4%;

`;
const Opciones2fav = styled.div`
paddig-right:2%;
h1{
  font-size:35px;
  color:black;
}
h2{
  margin-top:20px;
  font-size:20px;
  color:black;
}
h3{
  padding-right:3%;
  padding-left:5%;
  font-size:24px;
  color:black;
  
}
button{
  margin-top:20px;
  width:120px;
  heigth: 60px;
  background-color: rgb(35, 199, 35);
  border:none;
  font-style: bold;
  color:#fff;
  padding-bottom:6px;
  border-radius:5px;
}
button:hover{
  background-color:darkgreen;
}
.correo-info{
  display: none;
}
.id-pelicula{
  display:none;
}
.urlFavImagen{
  display: none;
}
.descrip_moviebd{
  display:none;
}
.calificacion{
display:flex;
align-items:center;

}
.select__calificacion{
  width:90px;
  font-size:20px;
  heigth:20px;
  margin-bottom:20px
  padding-top:2%;

}
.correo-info2{
  display: none;
}
.id-pelicula2{
  display:none;
}
.urlFavImagen2{
  display: none;
}
.descrip_moviebd2{
  display:none;
}
`;

const Opciones3fav = styled.div`

`;
const OpcionesCali = styled.div`
h3{
  color:black;
  font-size:18px;
  padding-left:2%;
}
select{
  
}
.comentario_personal{
  margin-top:5px;
}
button{
  margin-top:20px;
  width:90px;
  heigth: 60px;
  background-color: rgb(35, 199, 35);
  border:none;
  font-style: bold;
  color:#fff;
  padding-bottom:6px;
}
button:hover{
  background-color: darkgreen;
  transition: 0.5s;
}
.nombre__calificacion{
  font-size:35px;
  color:black;
}
.id__pelicula__cali{
  display:none;
}
.correo__cali{
  display:none;
}

`;
const Opciones3Cali = styled.div`
margin-left: 3%;
margin-top:4%;
`;