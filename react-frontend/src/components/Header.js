import React from "react"
import { Icon } from 'semantic-ui-react'

import { MovieSearchBar } from './MovieSearchBar'


export const Header = ({movies, filterMovies, reloadMovies, setActiveTab}) => {
    return (
      <header>
          <div class="navbar navbar-dark bg-dark shadow-sm">
              <div class="container d-flex justify-content-between">
                  <strong style={{ color: "white" }}>
                      <Icon name='film' />
                      Movie Lister
                  </strong>
              </div>
              <MovieSearchBar
                movies={movies}
                onMovieFilter={ids => filterMovies(ids)}
                reloadMovies = {reloadMovies}
                setActiveTab={setActiveTab}
              />
          </div>
      </header>
  )
}
