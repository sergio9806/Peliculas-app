import Dos from '../image/cubo_fondo.webp'
import "./css/Principal.css"
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styled from "styled-components";
import Modal from './Modal';
import Modal2 from './modal2';
import anime from 'animejs/lib/anime.es.js';
import firebaseapp from "../credenciales";
import { getFirestore, collection, addDoc, getDoc, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

const db = getFirestore(firebaseapp);
const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;
const IMAGE_PATH = process.env.REACT_APP_IMAGE_PATH;
const URL_IMAGE = process.env.REACT_APP_URL_IMAGE;

const Principal = ({ usuario }) => {
  //variables de estado 
  
  //para recuperar los datos especificos de la lista 
  const [subId, setsubId] = useState('');
  const [lista, setLista] = useState([])
  const [user, setUser] = useState({
    Nombre: '',
    Idpelicula: ''
  });
  const [userVista, setUserVista] = useState({
    Nombre: '',
    Idpelicula: ''
  });
  const [Window1, Windowstate] = useState(false);
  const [Window1vista, Windowstatevista] = useState(false);
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
  const capturardatos = () => {
    setUserVista({
      Nombre: movie.title,
      Idpelicula: movie.id,
      correo: usuario.email,
      urlima: URL_IMAGE + movie.poster_path,
      descrip_movie: movie.overview
    });
  }
  const capturardatosVistas = () => {
    setUserVista({
      Nombre: lista.Nombre,
      Idpelicula: lista.Idpelicula,
      correo: lista.correo,
      urlima: lista.urlima,
      descrip_movie: lista.overview,
      calificacion: handleCalificacionChange(),
      comentario_personal:handleComentarioChange()
      
    });
  }
  //funcion para guardar los datos  en la bd usuarios
  const guardarDatos = async (e) => {
    e.preventDefault();
    try {
      if (subId === '') {
        await addDoc(collection(db, 'usuarios'), { ...user });
      } else {
        await setDoc(doc(db, 'usuarios', subId), { ...user });
      }
      setUser({ Nombre: '', Idpelicula: '', correo: '', urlima: '', descrip_movie: '' }); // Reiniciar el estado del usuario
      setsubId('');
    } catch (error) {
      console.log(error);
    }
  }
  //funcion para guardar los datos  en la bd vistas
  const guardarDatosVistas = async (e) => {
    e.preventDefault();
    try {
      if (subId === '') {
        await addDoc(collection(db, 'vistas'), { ...userVista });
      } else {
        await setDoc(doc(db, 'vistas', subId), { ...userVista });
      }
      setUser({ Nombre: '', Idpelicula: '', correo: '', urlima: '', descrip_movie: '', comentario_personal: '', calificacion: ''}); 
    } catch (error) {
      console.log(error);
    }
  }
  

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
  //funcion para traer los datos 
  useEffect(() => {
    const getLista = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'usuarios'))
        const docs = []
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id })
        })
        setLista(docs)
      } catch (error) {

      }
    }
    getLista()
  }, [lista])
  //funcion para eliminar ususario
  const deleteUser = async (id) => {
    await deleteDoc(doc(db, 'usuarios', id))
  }
  //funcion para traer los datos espeficios 
  const getOne = async (id) => {
    try {
      const docRef = doc(db, 'usuarios', id)
      const docSnap = await getDoc(docRef)
      setUser(docSnap.data())
    } catch (error) {
      console.log(error);
    }

  }
  useEffect(() => {
    if (subId !== '') {
      getOne(subId)
    }

  }, [subId]);
  const handleCalificacionChange = (e) => {
    setUserVista({ ...userVista, calificacion: e.target.value });
  }

  // Función para actualizar el estado del usuario con el comentario personal ingresado
  const handleComentarioChange = (e) => {
    setUserVista({ ...userVista, comentario_personal: e.target.value });
  }
  //animacion 

  useEffect(() => {
    function randomValues() {
      anime({
        targets: ".square, .circle, .triangle",
        translateX: function () {
          return anime.random(-500, 500);
        },
        translateY: function () {
          return anime.random(-300, 300);
        },
        rotate: function () {
          return anime.random(0, 360);
        },
        scale: function () {
          return anime.random(0.2, 2);
        },
        duration: 5000,
        easing: "easeInOutQuad",
        complete: randomValues
      });
    }

    randomValues();


    return () => {
      anime.remove(".square, .circle, .triangle");
    };
  }, []);
  return (

    <main className='main__Principal'>
      <div>
        <img src={Dos} alt="" className='tamaño__imagen' height={800} />
        <div className="bodyp">
          <div className="square"></div>
          <div className="square"></div>
          <div className="square"></div>
          <div className="square"></div>
          <div className="square"></div>

          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>

          <div className="triangle"></div>
          <div className="triangle"></div>
          <div className="triangle"></div>
          <div className="triangle"></div>
          <div className="triangle"></div>
        </div>
      </div>
      <div>
        <form className="buscador__Principal" onSubmit={searchMovies}>
          <input className="buscador__barraP" type='text' placeholder='search' onChange={(e) => setSearchKey(e.target.value)} />
          <button className="buscador__botonP">Buscar</button>
        </form>
      </div>
      <div className='contenedor__Principal'>
        <div className='lado1'>
          <div>

          </div>
          {/* contenedor de poster de peliculas */}
          <div className='container__peliculas3'>

            <div className="container__principal3">
              <button role='button' id='flecha__izquierda3' className="flecha__izquierda3"> {'<'}</button>
              <div className="container__carousel3">
                <div className="carousel3" ref={fechtIndicadores}>
                  {movies.map((movie) => (
                    <div key={movie.id} className="Opciones__peliculas3" onClick={() => selectMovie(movie)}>
                      <img src={`${URL_IMAGE + movie.poster_path}`} alt="" />
                    </div>
                  ))}
                </div>
              </div>
              <button role='button' id='flecha__derecha3' className="flecha__derecha3">{'>'}</button>
            </div>
          </div>
        </div>
        <div className='lado2'>
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
          <div className="cast__list">
            <h3>Elenco:</h3>
            <p>{cast.map(actor => actor.name).join(", ")}</p>
          </div>
        </div>
      </div>
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
      <div className='card__fav'>
        <h1>Peliculas por ver</h1>
        <div className='Carousel__FavoritesContainer'>
          {
            lista
              .filter(list => list.correo === usuario.email)
              .map(list => (
                <div key={list.id} className='Carousel__Favorites1'>
                  <div key={list.Idpelicula} className='Carousel__Favorites'>
                    <div className='imgbox'>
                      <img className='img__carFav' src={list.urlima} alt="" />
                    </div>

                    <div className='details'>
                      <h1>{list.Nombre}</h1>
                      <section className='btnmovie'>
                        <button className='movie__vista' onClick={() => Windowstatevista(true)} >Película vista</button>
                      </section>
                      <Modal2
                        estado={Window1vista}
                        cambiarEstado={Windowstatevista}
                      >
                        <Opcionesfav>
                          <Opciones2fav>
                            <form onSubmit={guardarDatosVistas}>
                              <h1 name='Nombre_vista' >{list.Nombre}</h1>
                              <p name='Idpelicula_vista' className='id-pelicula2'>{list.Idpelicula}</p>
                              <p name='correo_vista' className='correo-info2'>{list.correo}</p>
                              <p name='urlima_vista' className='urlFavImagen2'>${list.urlima}</p>
                              <p name='descrip_movie_vista' className='descrip_moviebd2'>{list.overview}</p>
                              <div className='calificacion'>
                                <h3>Califica la película</h3>
                                <select name='calificacion' className='select__calificacion' onChange={handleCalificacionChange}>
                                  <option>Mala</option>
                                  <option>Regular</option>
                                  <option>Buena</option>
                                  <option>Muy buena</option>
                                  <option>Excelente</option>
                                </select>
                              </div>
                              <input name='comentario_personal' className='comentario_personal' placeholder='Añade un comentario sobre la pelicula' onChange={handleComentarioChange}></input>
                              <h2>¿Deseas agregar esta película a peliculas vistas?</h2>
                              <button onClick={capturardatosVistas}>Agregar</button>

                            </form>

                          </Opciones2fav>
                          <Opciones3fav>
                            <div key={movie.id}>

                              <img src={`${list.urlima}`} alt="" width={110} height={150} />
                            </div>
                          </Opciones3fav>
                        </Opcionesfav>

                      </Modal2>
                      <button className='btn__deleteMovie' onClick={() => deleteUser(list.id)}>
                        Eliminar película
                      </button>

                    </div>

                  </div>



                  <hr />
                </div>
              ))
          }
        </div>
      </div>


      <div>
        <h1>SECCION DE PELICULAS VISTAS </h1>
      </div>

      <div>
        <h1>SECCION DE VALORACION DE PELICULAS </h1>
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