
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import { useNavigate } from "react-router-dom";
import "./css/Detalles.css"

const Detalle = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const API_KEY = process.env.REACT_APP_API_KEY;
  const IMAGE_PATH = process.env.REACT_APP_IMAGE_PATH;
  const URL_IMAGE = process.env.REACT_APP_URL_IMAGE;
  const { movieId } = useParams();
  const [cast, setCast] = useState([]);
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`${API_URL}/movie/${movieId}`, {
          params: {
            api_key: API_KEY,
            append_to_response: 'videos,credits',
          },
        });
        const movieData = response.data;
        setMovie(movieData);

        if (movieData.videos && movieData.videos.results) {
          const officialTrailer = movieData.videos.results.find(vid => vid.name === "Official Trailer");
          setTrailer(officialTrailer ? officialTrailer : movieData.videos.results[0]);
        }
        setCast(response.data.credits.cast); // Establecer el elenco en el estado
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }

    };

    fetchMovie();
  }, [movieId]);

  const handlePlayTrailer = () => {
    setPlaying(true);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="Detalle__principal">
      {movie && (
        <div className="viewtrailer" style={{ backgroundImage: `url("https://image.tmdb.org/t/p/original${selectedImage ? selectedImage.file_path : movie.backdrop_path}")` }}>
          {playing ? (
            <>
              <YouTube
                videoId={trailer.key}
                className="reproductor container"
                containerClassName="youtube-container amru"
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
              <button onClick={() => setPlaying(false)} className="boton__cerrar">Cerrar</button>
            </>
          ) : (
            <div className="container__banner">
              <div>
                {trailer ? (
                  <button className="boton" onClick={handlePlayTrailer} type="button">Reproducir Tráiler</button>
                ) : (
                  <p>Lo siento, no hay tráiler disponible</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {movie && (
        <div className="container__informacion">
          <div>
            <div className="portada__pelicula"></div>
            <div className="informacion__pelicula">
              <h1 className="text-white">{movie.title}</h1>


              <p className="text-white">{movie.overview}</p>
              {/* Renderizar la información del elenco */}
              <div className="cast__list">
                <h3>Elenco:</h3>
                <p>{cast.map(actor => actor.name).join(", ")}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="container__principal">
          <button role='button' id='flecha__izquierda' className="flecha__izquierda"> {'>'}</button>
           <div className="container__carousel">
             <div className="carousel">
                 {movies.map((movie) => (
                   <div key={movie.id} className="Opciones__peliculas" onClick={() => selectMovie(movie)}>
                       <img src={`${URL_IMAGE + movie.poster_path}`} alt=""  />
                  </div>
             ))}
             </div>
             </div>
          <button role='button' id='flecha__derecha' className="flecha__derecha">{'<'}</button>
        </div>

      </div>
    </div>

  )
}

export default Detalle