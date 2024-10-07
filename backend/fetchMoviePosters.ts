import * as fs from 'fs'
import axios from 'axios';
import { movieData } from './movieData';
import dotenv from 'dotenv';

dotenv.config();

interface Movie {
  title: string;
  director: string;
  description: string;
  genre: string[];
  releaseDate?: string;
  posterUrl?: string;
}

const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

async function fetchMoviePoster(title: string): Promise<string | undefined> {
  try {
    // Search for the movie
    const searchResponse = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: title,
      },
    });

    if (searchResponse.data.results.length === 0) {
      console.log(`No results found for "${title}"`);
      return undefined;
    }

    const movieId = searchResponse.data.results[0].id;

    // Fetch movie details
    const detailsResponse = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
      },
    });

    const posterPath = detailsResponse.data.poster_path;
    if (!posterPath) {
      console.log(`No poster found for "${title}"`);
      return undefined;
    }

    return `${IMAGE_BASE_URL}${posterPath}`;
  } catch (error) {
    console.error(`Error fetching poster for "${title}":`, error);
    return undefined;
  }
}

async function updateMoviesWithPosters(movies: Movie[]): Promise<Movie[]> {
  const updatedMovies: Movie[] = [];

  for (const movie of movies) {
    const posterUrl = await fetchMoviePoster(movie.title);
    updatedMovies.push({ ...movie, posterUrl });
  }

  return updatedMovies;
}

// Use movieData imported from movieData.ts
updateMoviesWithPosters(movieData as Movie[])
     .then((updatedMovies) => {
       console.log(JSON.stringify(updatedMovies, null, 4)); 
       const jsonOutput = JSON.stringify(updatedMovies, null, 2);
       fs.writeFileSync('updatedMovies.json', jsonOutput);
       console.log('Updated movies have been saved to updatedMovies.json');
     })
     .catch((error) => {
       console.log(`Error updating movies: ${error}`);
     });