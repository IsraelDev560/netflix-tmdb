import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { NavbarFilmes } from '../NavbarFilmes';
import '../../../styles/Movies.css';

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

export const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
                    params: {
                        api_key: apiKey,
                        query: query,
                        page: 1,
                    }
                });

                if (response.data && response.data.results) {
                    setSearchResults(response.data.results);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error("Erro ao buscar filmes:", error);
            }
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    return (
        <>
            <NavbarFilmes />
            <div className="search-results">
                <h1>Resultados de busca para: "{query}"</h1>
                <div className='MovieSection'>
                    {searchResults.map((movie) => (
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
        </>
    );
};
