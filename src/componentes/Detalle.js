
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import { useNavigate } from "react-router-dom";
import "./css/Detalles.css"

const Detalle = () => {
  const API_URL = 'https://api.themoviedb.org/3'
  const API_KEY = '754424d785d8b491bc43ee5e13bb1a55'
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/original'
  const URL_IMAGE = 'https://image.tmdb.org/t/p/original'

  //variables de estado 
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [movie, setMovie] = useState({ title: "loading page" });
  const [playing, setPlaying] = useState(false);
  const [trailer, setTrailer] = useState(null);
//constantes para el carousel 
const filas = document.querySelector('.container__carousel');
const peliculas = document.querySelectorAll('.carousel');
const flechaIzquierda = document.getElementById('flecha__izquierda');
const flechaDerecha = document.getElementById('flecha__derecha');
//evento listener para flecha derecha
if (flechaDerecha !== null) {
  flechaDerecha.addEventListener('click', () =>{
    filas.scrollLeft += filas.offsetWidth;
  } );
}

if (flechaIzquierda !== null) {
  flechaIzquierda.addEventListener('click', () =>{
    filas.scrollLeft -= filas.offsetWidth;
  } );
}
//funcion para los indicadores 
const numeroPaginas = Math.ceil(peliculas.length / 5);
 for (let i = 0; i < numeroPaginas; i++) {
 const indicador = document.createElement('button');
if (i===0 ) {
  indicador.classList.add('activo');
}
 document.querySelector('.indicadores__peliculas').appendChild(indicador);
 indicador.addEventListener('click', (e)=> {
  filas.scrollLeft = i * filas.offsetWidth;
 })

 }


  //const [selectedMovie, setSelectedMovie] = useState({})
  const navegar = () => {

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
    <div className="Detalle__principal">
      {/* contenedor del banner y reproductor de video  */}
      <div>
        <main>
          {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className="reproductor container"
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="boton__cerrar">
                    Close
                  </button>
                </>
              ) : (
                <div className="container__banner">
                  <div className="">
                    {trailer ? (
                      <button
                        className="boton"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>
      {/* informacion sobre la pelicula  */}
      <div className="container__informacion">
        <div>
           <div className="portada__pelicula" > 
           </div>
              <div className="informacion__pelicula">
                     <h1 className="text-white">{movie.title}</h1>
                       <p className="text-white">{movie.overview}</p>
   
             </div> 
        
        </div>  
        
      </div>
      {/* contenedor de poster de peliculas */}
      <div className='container__peliculas'>
        <div className="peliculas__seccion">
          <h3 className="peliculas__recomendadas">Películas que podrían interesarte</h3>
          <div className="indicadores__peliculas">
            
          </div>
        </div>
        <div className="container__principal">
          <button role='button' id='flecha__izquierda' className="flecha__izquierda"> {'<'}</button>
           <div className="container__carousel">
             <div className="carousel">
                 {movies.map((movie) => (
                   <div key={movie.id} className="Opciones__peliculas" onClick={() => selectMovie(movie)}>
                       <img src={`${URL_IMAGE + movie.poster_path}`} alt=""  />
                  </div>
             ))}
             </div>
             </div>
          <button role='button' id='flecha__derecha' className="flecha__derecha">{'>'}</button>
        </div>
      </div>
    </div>

  )
}

export default Detalle