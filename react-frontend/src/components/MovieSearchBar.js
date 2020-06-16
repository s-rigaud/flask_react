import _ from 'lodash'
import React, { useState } from 'react'
import { Search, Label, Image } from 'semantic-ui-react'

export const MovieSearchBar = ({ movies, onSelectMovies, loadMovies }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState([])
    const [value, setValue] = useState('')

    const resultRenderer = ({ title, id }) =>
        <div>
            <Label content={title}/>
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
    const handleSearchChange = (e) => {
        setValue(e.target.value)
        setIsLoading(true)
        setTimeout(
            () => {
                if (value.length < 1) {
                    setIsLoading(false)
                    setResults([])
                    setValue('')
                    loadMovies()
                }
                const re = new RegExp(_.escapeRegExp(value), 'i')
                const isMatch = (result) => re.test(result.title)
                setIsLoading(false)
                setResults(_.filter(movies, isMatch))
            }
        , 300)
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