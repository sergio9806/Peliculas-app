import Portada from "../image/pantalla_cine2.jpg";
// import Uno from '../image/rollo-de-pelicula.png'
// import Dos from '../image/combo.png'
// import Tres from '../image/sodaneon.png';
import logo from "../image/palomitasneon.png";
// import combo from "../image/combo2.png";
// import lentes from "../image/lentesneon2.png";
// import refresco from "../image/refresconeon2.png";
// import camara from "../image/camara.png";
// import boleto from "../image/boleto.png";
// import accion from "../image/accion.png";
// import tira from "../image/tira.png";
import "./css/Principal.css";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import Modal from "./Modal";
import Modal2 from "./modal2";
import Modal3 from "./Modal3";
// import anime from 'animejs/lib/anime.es.js';
import firebaseapp from "../credenciales";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

const db = getFirestore(firebaseapp);
const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;
const URL_IMAGE = process.env.REACT_APP_URL_IMAGE;

const Principal = ({ usuario }) => {
  //variables de estado

  //para recuperar los datos especificos de la lista
  const [subId, setsubId] = useState("");
  const [lista, setLista] = useState([]);
  const [ListaVista, setListaVista] = useState([]);
  const [ListaCali, setListaCali] = useState([]);
  //datos de la tabla usuarios
  const [user, setUser] = useState({
    Nombre: "",
    Idpelicula: "",
    correo: "",
    urlima: "",
    descrip_movie: "",
  });
  //datos de la tabla de vistas
  const [userVista, setUserVista] = useState({
    Nombre: "",
    Idpelicula: "",
    correo: "",
    urlima: "",
    descrip_movie: "",
  });
  //datos tabla de calificaciones
  const [userCalificacion, setUserCalificacion] = useState({
    nombrePeli: "",
    Idpelicula: "",
    correo: "",
    calificacion: "",
    comentario: "",
  });
  const [Window1, Windowstate] = useState(false);
  const [Window1vista, Windowstatevista] = useState(false);
  const [Window1calificacion, Windowstatecalificacion] = useState(false);
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [movie, setMovie] = useState({ title: "loading page" });
  const [cast, setCast] = useState([]);
  //variables para carousel
  const filas = document.querySelector(".container__carousel3");
  const flechaIzquierda2 = document.getElementById("flecha__izquierda3");
  const flechaDerecha2 = document.getElementById("flecha__derecha3");
  //variables generales
  const contenedorPeliculasRef = useRef(null);
  //capturar los datos de la tabla usuarios
  const capturardatos = () => {
    setUser({
      Nombre: movie.title,
      Idpelicula: movie.id,
      correo: usuario.email,
      urlima: URL_IMAGE + movie.poster_path,
      descrip_movie: movie.overview,
    });
  };
  //capturar los datos de la tabla vistas
  const capturardatosVistas = (datosCarousel) => {
    setUserVista({
      Nombre: datosCarousel.Nombre,
      Idpelicula: datosCarousel.Idpelicula,
      correo: datosCarousel.correo,
      urlima: datosCarousel.urlima,
      descrip_movie: datosCarousel.overview,
    });
  };
  //capturar los datos de la tabla calificaciones
  const capturardatosCalificaciones = (datosCalificaciones) => {
    setUserCalificacion({
      Nombre: datosCalificaciones.Nombre,
      Idpelicula: datosCalificaciones.Idpelicula,
      correo: datosCalificaciones.correo,
      calificacion: datosCalificaciones.calificacion,
      comentario: datosCalificaciones.comentario,
    });
  };
  //constantes para mostrar u ocultar las categoias de las calificaciones
  const [mostrarMuyMalas, setMostrarMuyMalas] = useState(false);
  const [mostrarRegular, setMostrarRegular] = useState(false);
  const [mostrarBuenas, setMostrarBuenas] = useState(false);
  const [mostrarMuyBuenas, setMostrarMuyBuenas] = useState(false);
  const [mostrarExcelente, setMostrarExcelente] = useState(false);

  //use state para recargar los eliminados
  const [listaPeliculas, setListaPeliculas] = useState([]);

  //funcion para guardar los datos  en la bd usuarios
  const guardarDatos = async (e) => {
    e.preventDefault();
    try {
      if (subId === "") {
        await addDoc(collection(db, "usuarios"), { ...user });
      } else {
        await setDoc(doc(db, "usuarios", subId), { ...user });
      }
      setUser({
        Nombre: "",
        Idpelicula: "",
        correo: "",
        urlima: "",
        descrip_movie: "",
      });
      setsubId("");
      Windowstate(false);
    } catch (error) {
      console.log(error);
    }
  };
  //funcion para guardar los datos  en la bd vistas
  const guardarDatosVistas = async (e, datosPelicula, props) => {
    e.preventDefault();
    try {
      if (subId === "") {
        await addDoc(collection(db, "vistas"), { ...datosPelicula });
      } else {
        await setDoc(doc(db, "vistas", subId), { ...datosPelicula });
      }
      setUser({
        Nombre: "",
        Idpelicula: "",
        correo: "",
        urlima: "",
        descrip_movie: "",
      });
      setsubId("");
      Windowstatevista(false);
    } catch (error) {
      console.log(error);
    }
  };
  //funcion para guardar los datos  en la bd calificaciones
  const guardarDatosCalificaciones = async (e, list) => {
    e.preventDefault();
    try {
      const calificacionData = {
        Nombre__calificacion: list.Nombre,
        Idpelicula__calificacion: list.Idpelicula,
        correo__calificacion: list.correo,
        calificacion: userCalificacion.calificacion,
        comentario_personal: userCalificacion.comentario,
      };

      await addDoc(collection(db, "calificaciones"), calificacionData);
      // Aquí podrías también actualizar el estado local o hacer cualquier otra acción necesaria
    } catch (error) {
      console.error("Error al guardar la calificación:", error);
    }
  };

  useEffect(() => {
    const getListaCali = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "calificaciones"));
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setListaCali(docs);
      } catch (error) {
        console.log(error);
      }
    };
    getListaCali();
  }, []);
  //evento listener para flecha derecha
  const fechtIndicadores = () => {
    if (flechaDerecha2 !== null) {
      flechaDerecha2.addEventListener("click", () => {
        filas.scrollLeft += filas.offsetWidth;
      });
    }

    if (flechaIzquierda2 !== null) {
      flechaIzquierda2.addEventListener("click", () => {
        filas.scrollLeft -= filas.offsetWidth;
      });
    }
  };
  //useeffect posicionarse en la primera película
  useEffect(() => {
    if (contenedorPeliculasRef.current) {
      const primeraPelicula =
        contenedorPeliculasRef.current.querySelector(".col-md-4");
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

  //funcion para traer los datos
  useEffect(() => {
    const getLista = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setLista(docs);
      } catch (error) {
        console.error("Error al obtener lista de usuarios:", error);
      }
    };
    getLista();
  }, []);
  //funcion para traer los datos de la tabla vista
  useEffect(() => {
    const getListavista = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "vistas"));
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setListaVista(docs);
      } catch (error) {
        console.error("Error al obtener lista de vistas:", error);
      }
    };
    getListavista();
  }, []);
  //funcion para traer los datos de la tabla calificacion
  useEffect(() => {
    const getListaCali = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "calificacion"));
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setListaCali(docs);
      } catch (error) {
        console.error("Error al obtener lista de calificaciones:", error);
      }
    };
    getListaCali();
  }, []);
  //funcion para eliminar películas de la tabla usuarios
  const deleteUser = async (id) => {
    await deleteDoc(doc(db, "usuarios", id));
    setListaPeliculas(listaPeliculas.filter((movie) => movie.id !== id));
  };
  //funcion para eliminar películas de la tabla vistas
  const deleteUserVistas = async (id) => {
    await deleteDoc(doc(db, "vistas", id));
    // Después de eliminar la película, actualiza la lista de películas
    setListaPeliculas(listaPeliculas.filter((movie) => movie.id !== id));
  };
  //funcion para eliminar películas de la tabla vistas
  // const deleteUserCalificacion = async (id) => {
  //   await deleteDoc(doc(db, 'calificaciones', id))
  // }
  //funcion para traer los datos espeficios
  const getOne = async (id) => {
    try {
      const docRef = doc(db, "usuarios", id);
      const docSnap = await getDoc(docRef);
      setUser(docSnap.data());
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (subId !== "") {
      getOne(subId);
    }
  }, [subId]);

  //animacion

  /* useEffect(() => {
    function randomValues() {
      anime({
        targets: ".lentes1, .soda1, .palomitas1",
        translateX: function () {
          return anime.random(-100 + window.innerWidth * 0.5, 100 + window.innerWidth * 0.5);
        },
        translateY: function () {
          return anime.random(-300 + window.innerHeight * 0.42, 300 + window.innerHeight * 0.42);
        },
        rotate: function () {
          return anime.random(0, 40);
        },
        scale: function () {
          return anime.random(0.2, 2);
        },
        duration: 5000,
        easing: "easeInOutQuad",
        complete: function() {
          anime({
            targets: ".lentes1, .soda1, .palomitas1",
            translateX: window.innerWidth * 0.5,
            translateY: window.innerHeight * 0.42,
            duration: 5000,
            easing: "easeInOutQuad",
            complete: randomValues
          });
        }
      });
    }
  
    randomValues();
  
    return () => {
      anime.remove(".lentes1, .soda1, .palomitas1");
    };
  }, []);*/

  return (
    <main className="main__Principal">
      <section className="banner__animacion">
        <img src={Portada} alt="" className="tamaño__imagen" height={800} />
        <section className="bodyp">
          <article className="logo__cine">
            <img src={logo} alt="" className="tamaño__logo" />
          </article>
          <div className="titulo__movimiento">
            <span className="titulo__animado">MovieWorld</span>
          </div>
          {/* <article className="lentes1"><img src={Uno} alt="" className='tamaño__imagen' /></article>
          <article className="lentes2"><img src={Uno} alt="" className='tamaño__imagen' /></article>
          <article className="lentes3"><img src={Uno} alt="" className='tamaño__imagen' /></article>

          <article className="palomitas1"><img src={Tres} alt="" className='tamaño__imagen' /></article>
          <article className="palomitas2"><img src={Tres} alt="" className='tamaño__imagen' /></article>
          <article className="palomitas3"><img src={Tres} alt="" className='tamaño__imagen' /></article>
          
          <article className="soda2"><img src={Dos} alt="" className='tamaño__imagen' /></article>
          <article className="soda3"><img src={Dos} alt="" className='tamaño__imagen' /></article>
          *seccion fija*
          <article className="combo__neon"><img src={combo} alt="" className='tamaño__imagen' /></article>
          <article className="refresco__neon"><img src={refresco} alt="" className='tamaño__imagen' /></article>
          <article className="lentes__neon"><img src={lentes} alt="" className='tamaño__imagen' /></article>
          <article className="camara__neon"><img src={camara} alt="" className='tamaño__imagen' /></article>
          <article className="boleto__neon"><img src={boleto} alt="" className='tamaño__imagen' /></article>
          <article className="accion__neon"><img src={accion} alt="" className='tamaño__imagen' /></article>
  <article className="tira__neon"><img src={tira} alt="" className='tamaño__imagen' /></article>*/}
        </section>
      </section>
      <section>
        <form className="buscador__Principal" onSubmit={searchMovies}>
          <input
            className="buscador__barraP"
            type="text"
            placeholder="search"
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <button className="buscador__botonP">Buscar</button>
        </form>
      </section>
      <section className="contenedor__Principal">
        <section className="lado1">
          {/* contenedor de poster de peliculas */}
          <section className="container__peliculas3">
            <div className="container__principal3">
              <button id="flecha__izquierda3" className="flecha__izquierda3">
                {" "}
                {"<"}
              </button>
              <div className="container__carousel3">
                <div className="carousel3" ref={fechtIndicadores}>
                  {movies.map((movie) => (
                    <div
                      key={movie.id}
                      className="Opciones__peliculas3"
                      onClick={() => selectMovie(movie)}
                    >
                      <img src={`${URL_IMAGE + movie.poster_path}`} alt="" />
                    </div>
                  ))}
                </div>
              </div>
              <button id="flecha__derecha3" className="flecha__derecha3">
                {">"}
              </button>
            </div>
          </section>
        </section>
        <section className="lado2">
          <div className="title__button">
            <h1 className="text_movie">{movie.title}</h1>
            <button className="botton__movie">
              <span onClick={() => Windowstate(true)}>Agregar película</span>
            </button>
          </div>
          <div className="stats">
            <h2>{movie.release_date}</h2>
            <h2 className="text__vote">Votos: {movie.vote_count}</h2>
          </div>
          <p className="text__overview">{movie.overview}</p>
          {/* Renderizar la información del elenco */}
          <div className="cast__listPrincipal">
            <h3>Elenco:</h3>
            <p>{cast.map((actor) => actor.name).join(", ")}</p>
          </div>
        </section>
      </section>
      <Modal estado={Window1} cambiarEstado={Windowstate}>
        <Opciones>
          <Opciones2>
            <form onSubmit={guardarDatos}>
              <h1 name="Nombre">{movie.title}</h1>
              <p name="Idpelicula" className="id-pelicula">
                {movie.id}
              </p>
              <p name="correo" className="correo-info">
                {usuario.email}
              </p>
              <p name="urlima" className="urlFavImagen">
                ${URL_IMAGE + movie.poster_path}
              </p>
              <p name="descrip_movie" className="descrip_moviebd">
                {movie.overview}
              </p>
              <h2>¿Deseas agregar esta película a favoritos?</h2>
              <button onClick={capturardatos}>Agregar</button>
            </form>
          </Opciones2>
          <Opciones3>
            <div key={movie.id}>
              <img
                src={`${URL_IMAGE + movie.poster_path}`}
                alt=""
                width={110}
                height={150}
              />
            </div>
          </Opciones3>
        </Opciones>
      </Modal>

      {/* carrusel de peliculas por ver  */}
      <div className="card__fav">
        <h1>Películas por ver</h1>
        <div className="Carousel__FavoritesContainer">
          {lista
            .filter((list) => list.correo === usuario.email)
            .map((list) => (
              <div key={list.id} className="Carousel__Favorites1C">
                <div key={list.Idpelicula} className="Carousel__Favorites1">
                  <div className="imgbox">
                    <img className="img__carFav" src={list.urlima} alt="" />
                  </div>
                  <div className="details">
                    <h1>{list.Nombre}</h1>
                    <section className="btnmovie">
                      <button
                        className="movie__vista"
                        onClick={() => Windowstatevista(true)}
                      >
                        Película vista
                      </button>
                    </section>
                    <button
                      className="btn__deleteMovie"
                      onClick={() => deleteUser(list.id)}
                    >
                      Eliminar película
                    </button>
                    <Modal2
                      estadovista={Window1vista}
                      cambiarEstadovista={Windowstatevista}
                      capturardatosVistas={capturardatosVistas}
                      datosPelicula={list}
                    >
                      <Opcionesfav>
                        <Opciones2fav>
                          <form onSubmit={(e) => guardarDatosVistas(e, list)}>
                            <h1 name="Nombre_vista">{list.Nombre}</h1>
                            <p name="Idpelicula_vista" className="id-pelicula2">
                              {list.Idpelicula}
                            </p>
                            <p name="correo_vista" className="correo-info2">
                              {list.correo}
                            </p>
                            <p name="urlima_vista" className="urlFavImagen2">
                              ${list.urlima}
                            </p>
                            <p
                              name="descrip_movie_vista"
                              className="descrip_moviebd2"
                            >
                              {list.overview}
                            </p>
                            <h2>
                              ¿Deseas agregar esta película a peliculas vistas?
                            </h2>
                            <button
                              onClick={(e) =>
                                guardarDatosVistas(e, list, deleteUser(list.id))
                              }
                            >
                              Agregar
                            </button>
                          </form>
                        </Opciones2fav>
                        <Opciones3fav>
                          <div key={movie.id}>
                            <img
                              src={`${list.urlima}`}
                              alt=""
                              width={110}
                              height={150}
                            />
                          </div>
                        </Opciones3fav>
                      </Opcionesfav>
                    </Modal2>
                  </div>
                </div>

                <hr />
              </div>
            ))}
        </div>
      </div>

      {/* carrusel de peliculas vistas  */}
      <div className="card__fav2">
        <h1>Películas vistas</h1>
        <div className="Carousel__FavoritesContainer2C">
          {ListaVista.filter((list) => list.correo === usuario.email).map(
            (list) => (
              <div key={list.id} className="Carousel__Favorites2C">
                <div key={list.Idpelicula} className="Carousel__Favorites2">
                  <div className="imgbox1">
                    <img className="img__carFav1" src={list.urlima} alt="" />
                  </div>

                  <div className="details">
                    <h1>{list.Nombre}</h1>
                    <section className="btnmovie">
                      <button
                        className="movie__vista"
                        onClick={() => Windowstatecalificacion(true)}
                      >
                        Calificar
                      </button>
                    </section>
                    <button
                      className="btn__deleteMovie"
                      onClick={() => deleteUserVistas(list.id)}
                    >
                      Eliminar película
                    </button>
                  </div>
                </div>

                <Modal3
                  estadocalificacion={Window1calificacion}
                  cambiarEstadocalificacion={Windowstatecalificacion}
                  capturardatosCalificaciones={capturardatosCalificaciones}
                  datosPeliculacali={list}
                >
                  <Opciones>
                    <OpcionesCali>
                      <form
                        onSubmit={(e) => guardarDatosCalificaciones(e, list)}
                      >
                        {/* Aquí van los campos para la calificación */}
                        {/* Asegúrate de tener los campos necesarios en userCalificacion */}
                        <h1
                          name="Nombre__calificacion"
                          className="nombre__calificacion"
                        >
                          {list.Nombre}
                        </h1>
                        <p
                          name="Idpelicula__calificacion"
                          className="id__pelicula__cali"
                        >
                          {list.Idpelicula}
                        </p>
                        <p name="correo__calificacion" className="correo__cali">
                          {list.correo}
                        </p>
                        <h3>Califica la película</h3>
                        <select
                          name="calificacion"
                          className="select__calificacion"
                          value={userCalificacion.calificacion}
                          onChange={(e) =>
                            setUserCalificacion({
                              ...userCalificacion,
                              calificacion: e.target.value,
                            })
                          }
                        >
                          <option>Mala</option>
                          <option>Regular</option>
                          <option>Buena</option>
                          <option>Muy buena</option>
                          <option>Excelente</option>
                        </select>
                        <input
                          name="comentario_personal"
                          className="comentario_personal"
                          placeholder="Añade un comentario sobre la película"
                          value={userCalificacion.comentario} // Valor del estado
                          onChange={(e) =>
                            setUserCalificacion({
                              ...userCalificacion,
                              comentario: e.target.value,
                            })
                          }
                        />
                        <h2>¿Enviar calificación?</h2>
                        <button type="submit">Enviar</button>
                      </form>
                    </OpcionesCali>
                    <Opciones3Cali>
                      <div key={list.id}>
                        <img
                          src={`${list.urlima}`}
                          alt=""
                          width={120}
                          height={180}
                        />
                      </div>
                    </Opciones3Cali>
                  </Opciones>
                </Modal3>
                <hr />
              </div>
            )
          )}
        </div>
      </div>

      {/* valoracion de peliculas  */}

      <div className="div__calificaciones">
        <h1>SECCION DE VALORACION DE PELICULAS </h1>
        <div className="calificaciones">
          <button
            className="card"
            onClick={() => setMostrarMuyMalas(!mostrarMuyMalas)}
          >
            <span className="card__body">Muy malas</span>
          </button>
          <button
            className="card"
            onClick={() => setMostrarRegular(!mostrarRegular)}
          >
            <span className="card__body">Regular</span>
          </button>
          <button
            className="card"
            onClick={() => setMostrarBuenas(!mostrarBuenas)}
          >
            <span className="card__body">Buena</span>
          </button>
          <button
            className="card"
            onClick={() => setMostrarMuyBuenas(!mostrarMuyBuenas)}
          >
            <span className="card__body">Muy buena</span>
          </button>
          <button
            className="card"
            onClick={() => setMostrarExcelente(!mostrarExcelente)}
          >
            <span className="card__body">Excelente</span>
          </button>
        </div>
      </div>
      <div>
        {mostrarMuyMalas && (
          <div className="container_tables">
            {ListaCali.filter((list) => list.calificacion === "Mala").map(
              (list) => (
                <table className="tabla">
                  <caption>Pelicula</caption>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Calificación</th>
                      <th>Comentario</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td data-label="nombre">{list.Nombre__calificacion}</td>
                      <td data-label="calificacion">{list.calificacion}</td>
                      <td data-label="comentario">{list.comentario}</td>
                    </tr>
                  </tbody>
                </table>
              )
            )}
          </div>
        )}
        {mostrarRegular && (
          <article className="Regular">
            <h1>CONTENEDOR regular</h1>
          </article>
        )}
        {mostrarBuenas && (
          <article className="Buena">
            <h1>contenedor Buena</h1>
          </article>
        )}
        {mostrarMuyBuenas && (
          <article className="Muy__Buena">
            <h1>CONTENEDOR DE MUY buena</h1>
          </article>
        )}
        {mostrarExcelente && (
          <article className="Excelente">
            <h1>CONTENEDOR Excelente</h1>
          </article>
        )}
      </div>
    </main>
  );
};

export default Principal;
//practica con styled components
const Opciones = styled.div`
  display: flex;
  padding-right: 4%;
`;
const Opciones2 = styled.div`
  paddig-right: 2%;
  h1 {
    font-size: 35px;
  }
  h2 {
    margin-top: 20px;
    font-size: 20px;
  }
  button {
    margin-top: 20px;
    width: 90px;
    heigth: 60px;
    background-color: rgb(35, 199, 35);
    border: none;
    font-style: bold;
    color: #fff;
    padding-bottom: 6px;
  }
  button:hover {
    background-color: darkgreen;
    transition: 0.5s;
  }
  .correo-info {
    display: none;
  }
  .id-pelicula {
    display: none;
  }
  .urlFavImagen {
    display: none;
  }
  .descrip_moviebd {
    display: none;
  }
`;

const Opciones3 = styled.div``;
const Opcionesfav = styled.div`
  display: flex;
  padding-right: 4%;
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

const Opciones3fav = styled.div``;
const OpcionesCali = styled.div`
  h3 {
    color: black;
    font-size: 18px;
    padding-left: 2%;
  }
  select {
  }
  .comentario_personal {
    margin-top: 5px;
  }
  button {
    margin-top: 20px;
    width: 90px;
    heigth: 60px;
    background-color: rgb(35, 199, 35);
    border: none;
    font-style: bold;
    color: #fff;
    padding-bottom: 6px;
  }
  button:hover {
    background-color: darkgreen;
    transition: 0.5s;
  }
  .nombre__calificacion {
    font-size: 35px;
    color: black;
  }
  .id__pelicula__cali {
    display: none;
  }
  .correo__cali {
    display: none;
  }
`;
const Opciones3Cali = styled.div`
  margin-left: 7%;
  margin-top: 4%;
`;
