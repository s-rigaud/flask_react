import React, { useState } from "react"
import { Form, Input, Rating, Button, Segment } from "semantic-ui-react"

export const NewMovieForm = ({ onNewMovie }) => {
  const [title, setTitle] = useState("")
  const [rating, setRating] = useState(1)

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return (
    <Segment raised>
      <Form>
        <Form.Field>
          <Input
            placeholder="Movie Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <Rating
            icon="star"
            rating={rating}
            maxRating={5}
            onRate={(_, data) => {
              setRating(data.rating)
            }}
          />
        </Form.Field>
        <Form.Field>
          <Button
            onClick={async () => {
              setTitle(capitalize(title))
              let movie = { title, rating }
              movie.title = capitalize(title)
              const response = await fetch("/add_movie", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(movie)
              })

              if (response.ok) {
                movie['id'] = await response.json()
                onNewMovie(movie)
                setTitle("")
                setRating(1)
              }
            }}
          >
            Submit
          </Button>
        </Form.Field>
      </Form>
    </Segment>
  )
}