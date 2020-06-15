import React, {useState, useEffect} from 'react';
import { Movies } from './components/Movies';
import { NewMovieForm } from './components/NewMovieForm';
import { MovieSearchBar } from './components/MovieSearchBar';
import { Container } from 'semantic-ui-react';
import './App.css';

function App() {
  const [movies, setMovies]  = useState([])

  const loadMovies = () => {
    fetch("/movies").then(response =>
      response.json().then(data => {
        setMovies(data.movies)
      })
    )
  }

  const loadAndSelect = async(ids) => {
    await fetch("/movies").then(response =>
      response.json().then(data => {
        setMovies(data.movies)
      })
    )
    setMovies(currMovies => currMovies.filter(
      movie_ele => ids.includes(movie_ele.id)
    ))
  }

  useEffect(loadMovies, [])

  return (
    <div className="App">
      <Container style={{ marginTop: 40 }}>
        <NewMovieForm onNewMovie={movie => setMovies(currentMovies => [movie, ...currentMovies])}/>
        <Movies
          movies = {movies}
          onSelectMovies={ids => loadAndSelect(ids)}
          onDeleteMovie={movie => setMovies(currMovies => currMovies.filter(
            movie_ele => movie_ele.id !== movie.id
          ))}
        />
      </Container>
    </div>
  );
}

export default App;
