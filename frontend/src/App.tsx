import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

type Director = {
  id: string;
  name: string;
}

type Genre = {
  id: string;
  name: string;
}

type Movie = {
  id: string;
  title: string;
  description: string;
  genres: Genre[];
  director: Director;
  releaseDate: string;
  posterUrl: string;
}

type SearchSectionProps = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: React.MouseEventHandler<HTMLButtonElement>
}

type MovieCardProps = {
  movie: Movie
}

const SearchSection: React.FC<SearchSectionProps> = ({ query, setQuery, handleSearch }) => {

  return (
    <div className='flex flex-row mb-4'>
      <div>
        <input
          className='input input-bordered w-full max-w-xs'
          // the current value of the query state should be what is displayed in the box
          value={query}
          // whenever anything changes in the input field, assign this to setQuery
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {/* <button
        className='btn ml-2'
        onClick={handleSearch}>search</button> */}
    </div>
  )
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className='card card-side bg-slate-500 shadow-xl m-2'>
      {/* why does this work in making all the cards the same size? */}
      <figure className='poster poster w-full md:w-64 h-96 flex-shrink-0 overflow-hidden'>
        <img src={movie.posterUrl} alt={movie.title} />
      </figure>
      <div className='card-body'>
        <div className='caption text-5xl font-bebas-neue tracking-wide'>{movie.title} {movie.releaseDate.split(' ')[1]}</div>
        <div className='director text-2xl font-roboto'>{movie.director.name}</div>
        <div className='genres'>
          {movie.genres.map((genre, index) => {
            return (
              <span
                key={index}
                className='m-2'>
                {genre.name}
              </span>
            )
          })}
        </div>
        <div className='prose text-2xl mt-8'>{movie.description}</div>
      </div>
    </div>
  )
}

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('')
  const [movieData, setMovieData] = useState<Movie[]>([])

  // useEffect hook that triggers the search when the query changes
  // debounce technique to prevent too many API calls. 
  // waits for 300ms after the last keystroke before triggering the search.
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        handleSearch()
      } else {
        setMovieData([])
      }
    }, 100)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const handleSearch = async () => {
    // encodeURIComponent encodes special characters in a string to make it safe for use in a URL
    // the part after the ? in the URL is called the query string.
    // the ?query= part is not part of the actual data. It's just the syntax for specifying query parameters in a URL.
    // In req.query, you just get the key-value pair, not the ? or =
    const response = await axios.get<Movie[]>(`http://localhost:3010/api/movies/search?query=${encodeURIComponent(query)}`);
    console.log('axios response: ', response)
    setMovieData(response.data);
  }

  return (
    <div className='flex flex-col justify-center items-center mt-8'>
      <div className='font-sixtyfour text-4xl mb-8'>Something Good To Watch</div>
      {/* could be worth adding an "is Loading" text while results load */}
      <SearchSection query={query} setQuery={setQuery} handleSearch={handleSearch} />
      <div className='movie-cards'>
        {movieData.map(movie => (
          <MovieCard movie={movie} />
        ))}
      </div>
    </div>
  )

};

export default App
