import { NavbarFilmes } from '../NavbarFilmes';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogoStrangerThings from '../../../assets/logo-strangerthigns.png';
import axios from 'axios';
import '../../../styles/Movies.css';

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

export const Movies = () => {
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [dramaMovies, setDramaMovies] = useState([]);
    const [acaoMovies, setAcaoMovies] = useState([]);
    const [stranger, setStranger] = useState([]);

    const fetchMovies = async (endpoint, setter) => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3${endpoint}`, {
                params: {
                    api_key: apiKey,
                    page: 1,
                }
            });

            if (response.data && response.data.results) {
                setter(response.data.results);
            } else {
                setter([]);
            }
        } catch (error) {
            console.error(`Erro ao buscar filmes (${endpoint}): `, error);
        }
    };

    useEffect(() => {
        Promise.all([
            fetchMovies('/movie/top_rated', setTopRatedMovies),
            fetchMovies('/discover/movie?with_genres=18', setDramaMovies), // Genre ID for Drama is 18
            fetchMovies('/discover/movie?with_genres=28', setAcaoMovies), // Genre ID for Action is 28
            fetchMovies('/search/tv?query=Stranger%20Things', setStranger) // Using TV series endpoint
        ]).catch((error) => {
            console.error('Erro ao buscar filmes:', error);
        });
    }, []);

    const handleSearch = (query) => {
        fetchMovies(`/search/movie?query=${query}`, setTopRatedMovies);
    };

    return (
        <main>
            <NavbarFilmes onSearch={handleSearch} />
            <div className="filmes">
                <img src={LogoStrangerThings} alt="Logo Stranger Things" />
                <div className='Container'>
                    {stranger.length > 0 && stranger[0]?.name && (
                        <div className='SerieContainer'>
                            <h3>{stranger[0].name}</h3>
                            <div className='list'>
                                <span className='gray'>{new Date(stranger[0].first_air_date).getFullYear()}</span>
                                <span className='space'>|</span>
                                <p className='A16'> A16 </p>
                                <span className='space'>|</span>
                                <span className='gray'>
                                    {stranger[0]?.genres?.map(genre => genre.name).join(', ') || 'N/A'}
                                </span>
                            </div>
                            <p className='description'>
                                {stranger[0].overview || 'Descrição não disponível'}
                            </p>
                            <span className='gray'>Elenco: </span>{stranger[0].original_name || 'N/A'} <br />
                            <p className='gray'>Criação: <span className='white'>{stranger[0].original_language || 'N/A'}</span></p>
                        </div>
                    )}
                </div>
            </div>
            <div className='moviesPainel'>
                <div className='MoviesContainer'>
                    <h2>Mais Votados</h2>
                    <div className='MovieSection'>
                        {topRatedMovies.length > 0 && topRatedMovies.slice(0, 7).map((movie) => (
                            <div className='MovieCard' key={movie.id}>
                                <Link className='links' to={`/movie/${movie.id}`}>
                                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`${movie.title} Poster`} />
                                    <h3>{movie.title}</h3>
                                    <p>{new Date(movie.release_date).getFullYear()}</p>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <h2>Dramas</h2>
                    <div className='MovieSection'>
                        {dramaMovies.length > 0 && dramaMovies.slice(0, 7).map((movie) => (
                            <div className='MovieCard' key={movie.id}>
                                <Link className='links' to={`/movie/${movie.id}`}>
                                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`${movie.title} Poster`} />
                                    <h3>{movie.title}</h3>
                                    <p>{new Date(movie.release_date).getFullYear()}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <h2>Ação</h2>
                    <div className='MovieSection'>
                        {acaoMovies.length > 0 && acaoMovies.slice(0, 7).map((movie) => (
                            <div className='MovieCard' key={movie.id}>
                                <Link className='links' to={`/movie/${movie.id}`}>
                                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`${movie.title} Poster`} />
                                    <h3>{movie.title}</h3>
                                    <p>{new Date(movie.release_date).getFullYear()}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};
