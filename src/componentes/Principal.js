import Dos from '../image/cubo_fondo.webp'
import "./css/Principal.css"
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import "./css/Home.css";
import styled from "styled-components";
import Modal from './Modal';
import anime from 'animejs/lib/anime.es.js'; 
import firebaseapp from "../credenciales";
import {getFirestore,collection,addDoc,getDoc,doc,setDoc } from "firebase/firestore";

const db = getFirestore(firebaseapp);
const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;
const IMAGE_PATH = process.env.REACT_APP_IMAGE_PATH;
const URL_IMAGE = process.env.REACT_APP_URL_IMAGE;

const Principal = ({ usuario }) => {
  //variables de estado 
  //para recuperar los datos especificos de la lista 
  const [subId, setsubId] = useState('');
  const [user, setUser] = useState({
    Nombre: '', 
    Idpelicula: ''
  });
  const [Window1, Windowstate] = useState(false);
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
  const [setCategories] = useState([]);
  const capturardatos = () => {
    setUser({
      Nombre: movie.title,
      Idpelicula: movie.id
    });
  }
  //funcion para guardar los datos  en la bd
  const guardarDatos = async (e) => {
    e.preventDefault();
    try {
      if (subId === '') {
        await addDoc(collection(db, 'usuarios'), { ...user });
      } else {
        await setDoc(doc(db, 'usuarios', subId), { ...user });
      }
      setUser({ Nombre: '', Idpelicula: '' }); // Reiniciar el estado del usuario
      setsubId('');
      Windowstate(false);
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
    fetchCategories();
    fetchMovies();

  }, []);
  //funcion categorias 
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/genre/movie/list?api_key=${API_KEY}`);
      setCategories(response.data.genres);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

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

  //funcion para seeccionar pelicula
  const selectMovie = async (movie) => {
    fetchMovie(movie.id);
    setMovie(movie);
  };

  // funcion para buscar peliculas
  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };
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
            <span  onClick={() => Windowstate(true)} >Agregar película</span>
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
              <p name='Idpelicula'>{movie.id}</p>
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
      <div> 
      <h1>SECCION PARA RECUPERAR LOS DATOS DE LA BASE DE DATOS DE PELUCULAS POR VER </h1>    
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
  background-color: green;
  border:none;
  font-style: bold;
  color:#fff;
  padding-bottom:6px;
}
`;

const Opciones3 = styled.div`

`;