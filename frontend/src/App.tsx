import { useState, useEffect } from 'react'
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

const SearchSection: React.FC = () => {
  return (
    <div>

    </div>
  )
}

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('')
  const [movieData, setMovieData] = useState<Movie[]>([])

  return (
    <>

    </>
  )
}

export default App
