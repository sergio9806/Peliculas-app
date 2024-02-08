import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useNavigate} from "react-router-dom";



const Home = () => {
const API_URL = 'https://api.themoviedb.org/3'
const API_KEY = 'c3aec649e96085c3cf46900cb64a4aee'
const IMAGE_PATH = 'https://image.tmdb.org/t/p/original'
const URL_IMAGE = 'https://image.tmdb.org/t/p/original'

//variables de estado 
const navigate  = useNavigate();
const [movies, setMovies] = useState([])
const [searchKey, setSearchKey] = useState("")
const [movie, setMovie] = useState({title: "loading page"})
const [playing, setPlaying] = useState(false)
const [trailer, setTrailer] = useState(null)
//const [selectedMovie, setSelectedMovie] = useState({})
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
  //console.log('data',results);
  //setSelectedMovie(results[0])

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
  // const data = await fetchMovie(movie.id)
  // console.log(data);
  // setSelectedMovie(movie)
  fetchMovie(movie.id);

  setMovie(movie);
  window.scrollTo(0, 0);
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
    <div>
      {/*<h2 className='text-center mt-5 mb-5'> Trailers movies</h2>*/}
      {/* buscador */}
       <form className="buscador" onSubmit={searchMovies}>
        <input type='text' placeholder='search' onChange={(e)=>setSearchKey(e.target.value)}/>
        <button className='btn btn-primary'>Buscar</button>
      </form> 
      <div className="tags">
        <div className="tag"id='Accion'>Accion</div>
        <div className="tag" id='Aventura'>Aventura</div>
        <div className="tag">Drama</div>
        <div className="tag">Comedia</div>
        <div className="tag">Terror</div>
      </div>

       {/* contenedor del banner y reproductor de video  */}
       <div>
        <main>
          {movie ? (
            <div
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
                      "Sorry, no trailer available"
                    )}
                    <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                  </div>
                </div>
              
            </div>
          ) : null}
        </main>
      </div>

      {/* contenedor de poster de peliculas */}
      <div className='container mt-3'>
        <div className="row">
           {movies.map((movie)=> (
            <div key={movie.id} className='col-md-4 mb-3' onClick={()=>selectMovie(movie)}>
               <img src={`${URL_IMAGE + movie.poster_path}`} alt="" height={600} width="100%" />
               <h4 className='text-center'>{movie.title}</h4>
            </div>
           ))}
        </div>
      </div>
    </div>
    
  )
}

export default Home