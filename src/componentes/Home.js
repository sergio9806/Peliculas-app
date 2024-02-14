import React, { useEffect, useState,useRef } from 'react';
import axios from 'axios';
import "./css/Home.css";
import { useNavigate} from "react-router-dom";



const Home = () => {
  
const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;
const IMAGE_PATH = process.env.REACT_APP_IMAGE_PATH;
const URL_IMAGE = process.env.REACT_APP_URL_IMAGE;

//variables de estado 
const navigate  = useNavigate();
const [movies, setMovies] = useState([])
const [searchKey, setSearchKey] = useState("")
const [movie, setMovie] = useState({title: "loading page"})

const [trailer, setTrailer] = useState(null)
const firstMovieRef = useRef(null);
const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);


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

//const [selectedMovie, setSelectedMovie] = useState({})


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

const navegar = ()=> {
    
  navigate("/Detalle");
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
    <main className="container__home">
      {/*<h2 className='text-center mt-5 mb-5'> Trailers movies</h2>*/}
      {/* buscador */}
       <form className="buscador__home" onSubmit={searchMovies}>
        <input className="buscador__barrah" type='text' placeholder='search' onChange={(e)=>setSearchKey(e.target.value)}/>
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
       <div>
        
          {movie ? (
            <div
            ref={bannerImageRef}
            
              className="viewtrailer"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }} >
                  
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button
                        className="boton"
                        onClick={() => navegar()}
                        type="button"
                      >
                        Ver más
                      </button>
                    ) : (
                      "disculpas,informacion no encontrada"
                    )}
                    <h1 className="text__white">{movie.title}</h1>
                    <p className="text__white">{movie.overview}</p>
                  </div>
                </div>
              
            </div>
          ) : null}
        
      </div>
      {/* Contenedor de poster de películas */}
      <div className='container mt-3'>
                <div className="row">
                    {movies.map((movie, index) => (
                        <div key={movie.id} className='col-md-4 mb-3' onClick={() => selectMovie(movie)}>
                            {index === 0 && <div ref={firstMovieRef} />}
                            <img src={`${URL_IMAGE + movie.poster_path}`} alt="" height={600} width="100%" />
                            <h4 className='text-center'>{movie.title}</h4>
                        </div>
                    ))}
                </div>
            </div>
    </main>
    
  )
}

export default Home
