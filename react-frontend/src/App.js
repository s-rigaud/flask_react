import React, {useState, useEffect} from 'react'
import { Container } from 'semantic-ui-react'
import './App.css'

import { Header } from './components/Header'
import { MovieListing } from './components/MovieListing'
import { NewMovieForm } from './components/NewMovieForm'

function App() {
  const [activeTab, setActiveTab] = useState("All")
  const [movies, setMovies]  = useState([])
  const colors = ['', 'red', 'orange', 'yellow', 'olive', 'green']
  const icons = ['', 'thumbs down', 'thumbs up', 'fire', 'heart', 'trophy']

  const reloadMovies = async() => {
    let movieData = null
    await fetch("/movies").then(response =>
      response.json().then(data => {
        setMovies(data.movies)
        movieData = data.movies
      })
    )
    return movieData
  }

  const filterMovies = (ids) => {
    setMovies(currMovies => currMovies.filter(
      movie_ele => ids.includes(movie_ele.id)
    ))
  }

  useEffect(() => reloadMovies(), [])

  return (
    <div className="App">
      <Header
          // Props are mainly used for MovieSearchBar
          movies={movies}
          filterMovies={filterMovies}
          reloadMovies = {reloadMovies}
          setActiveTab={setActiveTab}
      />
      <Container style={{ marginTop: 40 }}>
        <NewMovieForm onNewMovie={movie => setMovies(currentMovies => [movie, ...currentMovies])}/>
        <MovieListing
          activeTab={activeTab}
          colors={colors}
          icons={icons}
          movies = {movies}
          reloadMovies={reloadMovies}
          setActiveTab={setActiveTab}
          onMovieFilter={ids => filterMovies(ids)}
          onDeleteMovie={movie => setMovies(currMovies => currMovies.filter(
            movie_ele => movie_ele.id !== movie.id
          ))}
        />
      </Container>
    </div>
  )
}

export default App
