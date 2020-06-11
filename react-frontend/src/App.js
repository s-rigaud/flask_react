import React, {useState, useEffect} from 'react';
import { Movies } from './components/Movies';
import { NewMovieForm } from './components/NewMovieForm';
import { Container } from 'semantic-ui-react';
import './App.css';

function App() {
  const [movies, setMovies]  = useState([]);

  useEffect(() => {
    fetch("/movies").then(response =>
      response.json().then(data => {
        setMovies(data.movies);
      })
    );
  }, []);

  return (
    <div className="App">
      <Container style={{ marginTop: 40 }}>
        <NewMovieForm onNewMovie={movie => setMovies(currentMovies => [movie, ...currentMovies])}/>
        <Movies movies = {movies} onDeleteMovie={movie => setMovies(currMovies => currMovies.filter(
          movie_ele => movie_ele.id !== movie.id
        ))}/>
      </Container>
    </div>
  );
}

export default App;
