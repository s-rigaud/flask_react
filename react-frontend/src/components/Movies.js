import React from 'react';
import { List, Header, Rating, Button } from 'semantic-ui-react';

export const Movies = ({ movies, onDeleteMovie }) => {

    const del = async(movie) =>{
        const url = "/movie/" + movie.id;
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
        if (response.ok){
            console.log('yay')
        }
        onDeleteMovie(movie)
    }

    return (
        <List>
            {movies.map(movie => {
                console.log(movie.id)
                return (
                    <List.Item key={movie.id}>
                        <Header>{movie.title}</Header>
                        <Rating rating={movie.rating} maxRating={5} disabled />
                        <Button content='X' color='red' onClick={e => del(movie)} />
                    </List.Item>
                );
            })}
        </List>
    )
}