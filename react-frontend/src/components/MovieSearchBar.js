import _ from 'lodash'
import React, { useState } from 'react'
import { Search, Label, Image } from 'semantic-ui-react'

export const MovieSearchBar = ({ movies, onSelectMovies, loadMovies }) => {
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
    onSelectMovies([result.id])
  }

  const handleSearchChange = (e, {value}) => {
    setValue(value)
    setIsLoading(true)

    setTimeout(async() => {
      await loadMovies()
      if (value.length < 1){
        setValue('')
        setResults([])
        setIsLoading(false)
      }
      const re = new RegExp(_.escapeRegExp(value), 'i')
      const isMatch = (result) => re.test(result.title)
      const correspondingMovies = _.filter(movies, isMatch)
      console.log(correspondingMovies)
      setResults(correspondingMovies)
      onSelectMovies(correspondingMovies.map(movie => movie.id))
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