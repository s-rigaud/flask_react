import React from 'react';
import { Rating, Button, Card, Image, Divider } from 'semantic-ui-react';

const colors = ['', 'red', 'orange', 'yellow', 'olive', 'green']

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
                    <Card key={movie.id} centered color={colors[movie.rating]} >
                        <Image
                            src={movie.id + ".png"}
                            wrapped
                            ui={true}
                            label={{ as: 'a', corner: 'left', icon: 'heart', color: colors[movie.rating] }}
                        />
                        <Card.Content>
                            <Card.Header>{movie.title}</Card.Header>
                            <Divider />
                            <Card.Meta>
                                <Rating icon='star' rating={movie.rating} maxRating={5} disabled />
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