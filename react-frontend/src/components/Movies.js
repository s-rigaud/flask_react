import React from 'react';
import { Rating, Button, Card, Image } from 'semantic-ui-react';

export const Movies = ({ movies, onDeleteMovie }) => {

    const del = async(movie) =>{
        const response = await fetch("/movie/" + movie.id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
        if (response.ok){
            console.log('del response ok');
            onDeleteMovie(movie)
        }
    }

    return (
        <Card.Group style={{ marginTop: 40 }}>
            {movies.map(movie => {
                return (
                    <Card>
                        <Image src={movie.id + ".png"} wrapped ui={true} />
                        <Card.Content>
                            <Card.Header>{movie.title}</Card.Header>
                            <Card.Meta>
                                <Rating rating={movie.rating} maxRating={5} disabled />
                            </Card.Meta>
                            <Card.Description>
                                <Button content='X' color='red' onClick={e => del(movie)} />
                            </Card.Description>
                        </Card.Content>
                  </Card>
                );
            })}
        </Card.Group>
    )
}