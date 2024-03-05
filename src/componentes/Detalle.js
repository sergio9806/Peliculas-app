import React, { useState, useEffect } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import { useParams } from 'react-router-dom';
import "./css/Detalles.css";

const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;
const IMAGE_PATH = process.env.REACT_APP_IMAGE_PATH;
const URL_IMAGE = process.env.REACT_APP_URL_IMAGE;
const Detalle = () => {

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

    return (
        <div className="Detalle__principal">
            {movie && (
                <div className="viewtrailer" style={{ backgroundImage: `url("https://image.tmdb.org/t/p/original${selectedImage ? selectedImage.file_path : movie.backdrop_path}")` }}>

                </div>
            )}

            {movie && (
                <div className="container__informacion">
                    <div className="informacion__movie">
                        <div className='info__movie'>
                            <h1 className="titulo__movie">{movie.title}</h1>
                            <div className='stats__detalle'>
                                <h2>{movie.release_date}</h2>
                                <h2 className='text__vote'>Votos: {movie.vote_count}</h2>
                            </div>
                            <p className="text__movie">{movie.overview}</p>
                            {/* Renderizar la información del elenco */}
                            <div className="cast__list">
                                <h3>Elenco:</h3>
                                <p>{cast.map(actor => actor.name).join(", ")}</p>
                            </div>
                        </div >
                        <div className='video__movie'>
                            {playing ? (
                                <>
                                    <YouTube
                                        videoId={trailer.key}
                                        className="reproductor__container"
                                        containerClassName="youtube-container amru"
                                        opts={{
                                            width: "90%", // 90% de ancho del contenedor
                                            height: "450vw", // Relación de aspecto de 16:9 (altura = ancho * 9/16)
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
                                    <button className="boton__close">
                                    <span onClick={() => setPlaying(false)} className="boton__cerrar">Cerrar</span>
                                         </button>
                                </>
                            ) : (
                                <div >
                                    <div>
                                        {trailer ? (
                                            <button className="boton__play">
                                                <span onClick={handlePlayTrailer}>Reproducir Tráiler</span>
                                            </button>
                                        ) : (
                                            <p>Lo siento, no hay tráiler disponible</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
};
export default Detalle