import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./css/Inicio.css"



const Inicio = () => {
const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;
const IMAGE_PATH = process.env.REACT_APP_IMAGE_PATH;
const URL_IMAGE = process.env.REACT_APP_URL_IMAGE;

  const navigate = useNavigate();
  const navegar = () => {

    navigate("/Login");
  }
  //variables de estado 
  const [movies, setMovies] = useState([])
  const [searchKey, setSearchKey] = useState("")
  const [movie, setMovie] = useState({ title: "loading page" })
  const [trailer, setTrailer] = useState(null)
  const [currentBannerMovie, setCurrentBannerMovie] = useState(null);
  //variable para busqueda por generos 
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  
  //variables para carousel
  const filas = document.querySelector('.container__carousel2');
  const flechaIzquierda2 = document.getElementById('flecha__izquierda2');
  const flechaDerecha2 = document.getElementById('flecha__derecha2');
  
  //
  useEffect(() => {
    fetchCategories();
    fetchMovies();
  }, []);
  
  useEffect(() => {
    if (movies.length > 0) {
      setCurrentBannerMovie(movies[0]); 
    }
  }, [movies]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/genre/movie/list?api_key=${API_KEY}`);
      setCategories(response.data.genres);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  //funcion para obtener la categoria de las peliculas y el scroll 
  const handleCategoryClick = async (categoryId) => {
    setCategory(categoryId);
    try {
      const response = await axios.get(`${API_URL}/discover/movie?api_key=${API_KEY}&with_genres=${categoryId}`);
      setMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
    setTimeout(() => {
      const container = document.querySelector('.container__carousel2');
      container.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };
  //evento listener para flecha derecha
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
    //return data
    setMovie(data);
  };

  const selectMovie = async (movie) => {
    await fetchMovie(movie.id);
    setMovie(movie);
    setCurrentBannerMovie(movie);
    setTimeout(() => {
      const banner = document.querySelector('.banner__inicio');
      banner.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };
  // funcion para buscar peliculas
  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };


  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="Container__inicio">
      
      <div className="categorias" >
      <h3 className="titulo">Categorias</h3>
        <ul className="lista__generos" >
        
          {categories.map((category) => (
            <li className="generos" key={category.id} >
              <button className="nombre__genero" onClick={() => handleCategoryClick(category.id)}>{category.name}</button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="seccion__2">
        {/* buscador */}

        <form className="buscador" onSubmit={searchMovies}>
         
          <input  className="buscador__barra" type='text' placeholder='search' onChange={(e) => setSearchKey(e.target.value)} />
          <button className="buscador__boton">Buscar</button>
          
        </form>
        {/* contenedor del banner y reproductor de video  */}
        <div className="banner__sombra">
          <main className="imagen__confi">
            {currentBannerMovie ? (

              <div
                className="banner__inicio"
                style={{
                  backgroundImage: `url("${IMAGE_PATH}${currentBannerMovie.backdrop_path}")`,

                }}
              >

                <div className="container">
                  <div className="">

                    <h1 className="text-white">{currentBannerMovie.title}</h1>
                    <p className="text-white">{currentBannerMovie.overview}</p>
                  </div>

                  <button className="Boton__verAhora" role='button' onClick={navegar}> Ver ahora </button>

                </div>

              </div>
            ) : null}
          </main>
        </div>

        {/* contenedor de poster de peliculas */}
        <div className='container__peliculas2'>
          <div className="peliculas__seccion2">
            <h3 className="peliculas__recomendadas2">Peliculas recomendadas</h3>
            <div className="indicadores_peliculas2">

            </div>
          </div>
          <div className="container__principal2">
            <button role='button' id='flecha__izquierda2' className="flecha__izquierda2"> {'<'}</button>
            <div className="container__carousel2">
              <div className="carousel2">
                {movies.map((movie) => (
                  <div key={movie.id} className="Opciones__peliculas2" onClick={() => selectMovie(movie)}>
                    <img src={`${URL_IMAGE + movie.poster_path}`} alt="" />
                  </div>
                ))}
              </div>
            </div>
            <button role='button' id='flecha__derecha2' className="flecha__derecha2">{'>'}</button>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Inicio 
