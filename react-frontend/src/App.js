import React, {useState, useEffect} from 'react';
import { Movies } from './components/Movies';
import { NewMovieForm } from './components/NewMovieForm';
import { MovieSearchBar } from './components/MovieSearchBar';
import { Container } from 'semantic-ui-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState("All")
  const [movies, setMovies]  = useState([])
  const colors = ['', 'red', 'orange', 'yellow', 'olive', 'green']
  const icons = ['', 'thumbs down', 'thumbs up outline', 'thumbs up', 'heart', 'trophy']

  const reloadMovies = async() => {
    let movieData = null;
    await fetch("/movies").then(response =>
      response.json().then(data => {
        setMovies(data.movies)
        movieData = data.movies
        console.log("movies retrieved")
        console.log("movies ", data.movies)
      })
    )
    return movieData
  }

  const filterMovies = async(ids) => {
    setMovies(currMovies => currMovies.filter(
      movie_ele => ids.includes(movie_ele.id)
    ))
  }

  useEffect(reloadMovies, [])

  return (
    <div className="App">
      <Container style={{ marginTop: 40 }}>
        <NewMovieForm onNewMovie={movie => setMovies(currentMovies => [movie, ...currentMovies])}/>
        <MovieSearchBar
          onMovieFilter={ids => filterMovies(ids)}
          reloadMovies = {reloadMovies}
          setActiveTab={setActiveTab}
        />
        <Movies
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
  );
}

export default App;
