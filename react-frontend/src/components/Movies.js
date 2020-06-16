import React, { useState } from 'react';
import { Rating, Button, Card, Image, Divider, Menu, Segment } from 'semantic-ui-react';

export const Movies = ({ movies, colors, onSelectMovies, onDeleteMovie }) => {

    const [activeItem, setActiveItem] = useState("All")
    const handleItemClick = (e, { name }) => {
        setActiveItem(name)
        let category_rating = (name.split("✰").length - 1)
        let ids = []
        for (let movie of movies){
            if (name === "All") category_rating = movie.rating
            if (movie.rating === category_rating){
                ids.push(movie.id)
            }
        }
        onSelectMovies(ids)
    }

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
        <Segment>
            <Menu pointing secondary>
                <Menu.Item
                    name='All'
                    active={activeItem === 'All'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='✰✰✰✰✰'
                    active={activeItem === '✰✰✰✰✰'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='✰✰✰✰'
                    active={activeItem === '✰✰✰✰'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='✰✰✰'
                    active={activeItem === '✰✰✰'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='✰✰'
                    active={activeItem === '✰✰'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='✰'
                    active={activeItem === '✰'}
                    onClick={handleItemClick}
                />
            </Menu>

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
        </Segment>
    )
}