import _ from 'lodash'
import React, { useState } from 'react'
import { Search, Label, Image } from 'semantic-ui-react'

export const MovieSearchBar = ({ onMovieFilter, reloadMovies, setActiveTab }) => {
    const [value, setValue] = useState("")
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const resultRenderer = ({ id, title }) =>
      <div>
        <Label content={title} />
        <Image
          src={id+1 + ".png"}
          wrapped
          ui={true}
        />
      </div>

  const handleResultSelect = (e, { result }) => {
    setValue(result.title)
    onMovieFilter([result.id])
    setActiveTab("✰".repeat(result.rating))
  }

  const handleSearchChange = (e, {value}) => {
    setValue(value)
    setIsLoading(true)

     setTimeout(async() => {
      if (value.length < 1){
        setValue('')
        // Retrieve data directly else movies variable content is outdated
        let movieData = await reloadMovies()
        setResults(movieData)
        setIsLoading(false)
        setActiveTab("All")
        return
      }
      const re = new RegExp(_.escapeRegExp(value), 'i')
      const isMatch = (result) => re.test(result.title)

      // Retrieve data directly else movies variable content is outdated
      let movieData = await reloadMovies()
      const correspondingMovies = _.filter(movieData, isMatch)
      console.log("correspondingMovies", correspondingMovies)
      setResults(correspondingMovies)
      onMovieFilter(correspondingMovies.map(movie => movie.id))
      setIsLoading(false)
    }, 300)

  }

    return (
      <Search
        loading={isLoading}
        onResultSelect={handleResultSelect}
        onSearchChange={_.debounce(handleSearchChange, 500, {
          leading: true,
        })}
        results={results}
        value={value}
        resultRenderer={resultRenderer}
      />

    )
}