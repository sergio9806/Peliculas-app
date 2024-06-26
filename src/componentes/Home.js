import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import "./css/Home.css";
import { useNavigate } from "react-router-dom";

//variables de entorno 
const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;
const IMAGE_PATH = process.env.REACT_APP_IMAGE_PATH;
const URL_IMAGE = process.env.REACT_APP_URL_IMAGE;

const Home = () => {
  //variables de estado 
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [allmovies, setAlMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [movie, setMovie] = useState({ title: "loading page" });
  const [trailer, setTrailer] = useState(null);
  const firstMovieRef = useRef(null);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  //variables para carousel peliculas recomendadas
  const filas = document.querySelector('.container__carousel');
  const flechaIzquierda = document.getElementById('flecha__izquierda');
  const flechaDerecha = document.getElementById('flecha__derecha');
  // variables  películas mejor rankeadas
  const filasTopRated = document.querySelector('.container__carousel2');
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const flechaIzquierdaTopRated = document.getElementById('flecha__izquierda_top_rated');
  const flechaDerechaTopRated = document.getElementById('flecha__derecha_top_rated');
  //variables peliculas populares 
  // const filasPopulares = document.querySelector('.container__carousel3');
  // const [Populares, setPopulares] = useState([]);
  // const flechaIzquierdaPopulares = document.getElementById('flecha__izquierda_top_rated');
  // const flechaDerechaPopulares  = document.getElementById('flecha__derecha_top_rated');
  const filasProximos = document.querySelector('.container__proximas');
  const [ProximoLanza, setProximoLanza] = useState([]);
  const flechaIzquierdaProximo = document.getElementById('flecha__izquierda_proximas');
  const flechaDerechaProximo = document.getElementById('flecha__derecha_proximas');
  // Llama a la función para cargar las películas mejor rankeadas en el useEffect
  useEffect(() => {
    fetchTopRatedMovies();
    fetchProximosLanzamientos();
    // fetchMoviesByCategory('now_playing', 'Now Playing');
    // fetchMoviesByCategory('upcoming', 'Upcoming');
    // fetchMoviesByCategory('popular', 'Popular');
  }, []);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const fetchTopRatedMovies = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/movie/top_rated?api_key=${API_KEY}`);
      setTopRatedMovies(data.results);
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
    }
  };
  

  const fetchProximosLanzamientos = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/movie/upcoming?api_key=${API_KEY}`);
      setProximoLanza(data.results);
    } catch (error) {
      console.error('Error fetching proximo lanzamiento:', error);
    }
  };
  //eindicadores peliculas recomendadas 
  const fechtIndicadoresPR = () => {
    if (flechaDerecha !== null) {
      flechaDerecha.addEventListener('click', () => {
        filas.scrollLeft += filas.offsetWidth;
      });
    }

    if (flechaIzquierda !== null) {
      flechaIzquierda.addEventListener('click', () => {
        filas.scrollLeft -= filas.offsetWidth;
      });
    }
  }
  //indicadores peliculas mejores rankeadas 
  const fechtIndicadores = () => {
    if (flechaDerechaTopRated !== null) {
      flechaDerechaTopRated.addEventListener('click', () => {
        filasTopRated.scrollLeft += filasTopRated.offsetWidth;
      });
    }

    if (flechaIzquierdaTopRated !== null) {
      flechaIzquierdaTopRated.addEventListener('click', () => {
        filasTopRated.scrollLeft -= filasTopRated.offsetWidth;
      });
    }
  }
  //indicadores peliculas proximos lanzamintos 
  const fechtIndicadoresproxi = () => {
    if (flechaDerechaProximo !== null) {
      flechaDerechaProximo.addEventListener('click', () => {
        filasProximos.scrollLeft += filasProximos.offsetWidth;
      });
    }

    if (flechaIzquierdaProximo !== null) {
      flechaIzquierdaProximo.addEventListener('click', () => {
        filasProximos.scrollLeft -= filasProximos.offsetWidth;
      });
    }
  }
  // constantes para el scroll 
  const bannerImageRef = useRef(null);
  const contenedorPeliculasRef = useRef(null);


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

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/genre/movie/list?api_key=${API_KEY}`);
      setCategories(response.data.genres);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const handleCategoryClick = async (categoryId) => {
    setCategory(categoryId);
    try {
      const response = await axios.get(`${API_URL}/discover/movie?api_key=${API_KEY}&with_genres=${categoryId}`);
      setMovies(response.data.results);
      if (firstMovieRef.current) {
        firstMovieRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const navegar = (movieId) => {
    navigate(`/Detalle/${movieId}`);
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
    setAlMovies(results);



    if (results.length) {
      await fetchMovie(results[0].id);
    }

  };

  // funcion para la peticion de un solo objeto y mostrar en reproductor de videos
  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
      },
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    setMovie(data);

  };


  //funcion para seleccionar pelicula 
  const selectMovie = async (movie) => {
    // const data = await fetchMovie(movie.id)
    // console.log(data);
    // setSelectedMovie(movie)
    fetchMovie(movie.id);
    setMovie(movie);

    //scroll hacian imagen del banner 
    if (bannerImageRef.current) {
      bannerImageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // funcion para buscar peliculas
  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  return (
    <div className="container__home">
      <div id='progress'></div>
      {/*<h2 className='text-center mt-5 mb-5'> Trailers movies</h2>*/}
      {/* buscador */}
      <div className="categorias__hamburguesa" >
        <span className='activar__menu' onClick={toggleMenu}>
          Categorías
          ☰
        </span>
        {menuOpen && (
        <ul className="lista__generos_Hamburguesa" >

          {categories.map((category) => (
            <li className="generos__hamburgesa" key={category.id} >
              <button className="nombre__genero_hamburguesa" onClick={() => handleCategoryClick(category.id)}>{category.name}</button>
            </li>
          ))}
        </ul>
        )}
      </div>

      
      <form className="buscador__home" onSubmit={searchMovies}>
        <input className="buscador__barrah" type='text' placeholder='search' onChange={(e) => setSearchKey(e.target.value)} />
        <button className="buscador__botonh">Buscar</button>
      </form>
      <div className="categorias__tags" >
        <ul className="tags" >
          {categories.map((category) => (
            <li className="etiqueta__generos" key={category.id} >
              <button className="tag" onClick={() => handleCategoryClick(category.id)}
              // style={{
              //   backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              // }} 
              >{category.name}</button>
            </li>
          ))}
        </ul>
      </div>
      {/* contenedor del banner y reproductor de video  */}
      <div
  ref={bannerImageRef}
  className="viewtrailer"
  style={{
    position: 'relative', // Establece la posición relativa para el contenedor
    backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
  }}
>
  {/* Div para el degradado de sombra */}
  <div
    style={{
      position: 'absolute', // Establece la posición absoluta para la superposición
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 70%)', // Crea el degradado de sombra
    }}
  />

  
  <div className="container"  style={{ position: 'relative', zIndex: '1' }}>
    <div className="">
      {trailer ? (
        <button
          className="boton"
          onClick={() => navegar(movie.id)}
          type="button"
        >
          Ver más
        </button>
      ) : (
        "Disculpas, información no encontrada"
      )}
      <h1 className="text__white">{movie.title}</h1>
      <p className="text__white">{movie.overview}</p>
    </div>
  </div>
</div>
      {/* contenedor de poster de peliculas */}
      <div className='container__peliculas'>
        <div className="peliculas__seccion">
          <h3 className="peliculas__recomendadas">Peliculas recomendadas</h3>
          <div className="indicadores_peliculas">
          </div>
        </div>
        <div className="container__principal">
          <button role='button' id='flecha__izquierda' className="flecha__izquierda"> {'<'}</button>
          <div className="container__carousel">
            <div className="carousel" ref={fechtIndicadoresPR}>
              {movies?.map((movie) => (
                <div key={movie.id} className="Opciones__peliculas" onClick={() => selectMovie(movie)}>
                  <img className='img_tamaño' src={`${URL_IMAGE + movie.poster_path}`} alt=""  />
                </div>
              ))}
            </div>
          </div>
          <button role='button' id='flecha__derecha' className="flecha__derecha">{'>'}</button>
        </div>
      </div>

      {/* contenedor de poster de peliculas mejor rankeadas */}
      <div className='container__peliculas2'>
        <div className="peliculas__seccion2">
          <h3 className="peliculas__recomendadas2">Mejor rankeadas</h3>
          <div className="indicadores_peliculas2">

          </div>
        </div>
        <div className="container__principal2">
          <button role='button' id='flecha__izquierda_top_rated' className="flecha__izquierda_top_rated"> {'<'}</button>
          <div className="container__carousel2">
            <div className="carousel4" ref={fechtIndicadores}>
              {topRatedMovies.map(movie => (
                <div key={movie.id} className="Opciones__peliculas2" onClick={() => selectMovie(movie)}>
                  <img className='img_tamaño' src={`${URL_IMAGE + movie.poster_path}`} alt=""  />
                </div>
              ))}
            </div>
          </div>
          <button role='button' id='flecha__derecha_top_rated' className="flecha__derecha_top_rated">{'>'}</button>
        </div>
      </div>
      {/* contenedor de poster de peliculas proximas a salir  */}
      <div className='container__peliculas3'>
        <div className="peliculas__seccion3">
          <h3 className="peliculas__proximas">Próximos lanzamientos</h3>
          <div className="indicadores_proximas">

          </div>
        </div>
        <div className="container__principalproximas">
          <button role='button' id='flecha__izquierda_proximas' className="flecha__izquierda_proximas"> {'<'}</button>
          <div className="container__proximas">
            <div className="carousel5" ref={fechtIndicadoresproxi}>
              {ProximoLanza.map(movie => (
                <div key={movie.id} className="Opciones__proximas" onClick={() => selectMovie(movie)}>
                  <img className='img_tamaño' src={`${URL_IMAGE + movie.poster_path}`} alt=""  />
                </div>
              ))}
            </div>
          </div>
          <button role='button' id='flecha__derecha_proximas' className="flecha__derecha_proximas">{'>'}</button>
        </div>
        </div>
    </div>
  )
}

export default Home
