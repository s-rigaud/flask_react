import React, {useState, useEffect} from 'react';
import { Movies } from './components/Movies';
import { MovieForm } from './components/MovieForm';
import { Container } from 'semantic-ui-react';
import './App.css';

function App() {
  const [movies, setMovies]  = useState([]);

  const mySplice = (array, element) => {
    array.splice(array.indexOf(element), 1);
    return array;
  }

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
        <MovieForm onNewMovie={movie => setMovies(currentMovies => [movie, ...currentMovies])}/>
        <Movies movies = {movies} onDeleteMovie={movie => setMovies(currMovies => mySplice(currMovies, movie))}
        />
      </Container>
    </div>
  );
}

export default App;
