import _ from 'lodash'
import React, { useState } from 'react'
import { Search, Label, Image, Icon } from 'semantic-ui-react'

export const MovieSearchBar = ({ movies, onMovieFilter, reloadMovies, setActiveTab }) => {
    const [value, setValue] = useState("")
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const resetSearch = async() => {
      setValue("")
      // Retrieve movie data directly else movies variable content is outdated
      let movieData = await reloadMovies()
      setResults(movieData)
      setIsLoading(false)
      setActiveTab("All")
    }

    const resultRenderer = ({title, rating}) => {
      // Id is redifined as it represents the position in the array
      // Have to make ugly workaround to obtain real movie id from backend
      let movie = movies.filter(movie => movie.title === title && movie.rating === rating)[0]
      if (movie !== undefined){
        return (
          <div>
            <Label content={title} />
            <Label content={rating} />
            <Image
              src={movie.id + ".png"}
              wrapped
              ui={true}
            />
          </div>
        )
      }
    }

    const handleResultSelect = (e, { result }) => {
      // Update search bar from selected movie
      setResults([result])
      setValue(result.title)
      onMovieFilter([result.id])
      setActiveTab("✰".repeat(result.rating))
    }

    const handleSearchChange = (e, {value}) => {
      // Return movies corresponding to search
      setValue(value)
      setIsLoading(true)

      setTimeout(async() => {
        if (value.length < 1){
          await resetSearch()
          return
        }
        const re = new RegExp(_.escapeRegExp(value), "i")
        const isMatch = (result) => re.test(result.title)

        // Retrieve movie data directly else movies variable content is outdated
        let movieData = await reloadMovies()
        const correspondingMovies = _.filter(movieData, isMatch)
        setResults(correspondingMovies)
        onMovieFilter(correspondingMovies.map(movie => movie.id))
        setIsLoading(false)
      }, 300)

    }

    return (
      <Search
        placeholder="Search for a movie"
        loading={isLoading}
        onResultSelect={handleResultSelect}
        onSearchChange={_.debounce(handleSearchChange, 500, {
          leading: true,
        })}
        results={results}
        value={value}
        resultRenderer={resultRenderer}
        icon={<Icon name='search' inverted circular link />}
      />
    )
}
