import React, { useState } from 'react'
import { Rating, Button, Card, Image, Divider, Menu, Segment, Confirm } from 'semantic-ui-react'

export const Movies = ({ movies, activeTab, colors, icons, reloadMovies, setActiveTab, onMovieFilter, onDeleteMovie }) => {

    const [showPopup, setShowPopup] = useState(false)
    const [popupContent, setPopupContent] = useState("")
    const [targetedMovie, setTargetedMovie] = useState(null)

    const showDeletePopup = (movie) => {
        setPopupContent("Are you sure that you want to delete " + movie.title + " ?")
        setTargetedMovie(movie)
        setShowPopup(true)
    }
    const handleConfirm = () => {
        del(targetedMovie)
        setShowPopup(false)
    }
    const handleCancel = () => setShowPopup(false)

    const handleTabChange = async(e, { name }) => {
        setActiveTab(name)

        // Retrieve data directly else movies variable content is outdated
        let movieData = await reloadMovies()
        let category_rating = (name.split("✰").length - 1)

        if (name === "All"){
            onMovieFilter(movieData.map(movie => movie.id))
        }else{
            onMovieFilter(movieData.filter(movie => movie.rating === category_rating).map(movie => movie.id))
        }
    }

    const del = async(movie) =>{
        const response = await fetch("/movie/" + movie.id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
        if (response.ok){
            console.log('del response ok')
            onDeleteMovie(movie)
        }
    }

    return (
        <Segment>
            <Menu pointing secondary>
                <Menu.Item
                    name='All'
                    active={activeTab === 'All'}
                    onClick={handleTabChange}
                />
                <Menu.Item
                    name='✰✰✰✰✰'
                    active={activeTab === '✰✰✰✰✰'}
                    onClick={handleTabChange}
                />
                <Menu.Item
                    name='✰✰✰✰'
                    active={activeTab === '✰✰✰✰'}
                    onClick={handleTabChange}
                />
                <Menu.Item
                    name='✰✰✰'
                    active={activeTab === '✰✰✰'}
                    onClick={handleTabChange}
                />
                <Menu.Item
                    name='✰✰'
                    active={activeTab === '✰✰'}
                    onClick={handleTabChange}
                />
                <Menu.Item
                    name='✰'
                    active={activeTab === '✰'}
                    onClick={handleTabChange}
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
                                label={{ as: 'a', corner: 'left', icon: icons[movie.rating], color: colors[movie.rating] }}
                            />
                            <Card.Content>
                                <Card.Header>{movie.title}</Card.Header>
                                <Divider />
                                <Card.Meta>
                                    <Rating icon='star' rating={movie.rating} maxRating={5} disabled />
                                </Card.Meta>
                                <Card.Description>
                                    <Button onClick={() => showDeletePopup(movie)} color='red'>X</Button>
                                    <Confirm
                                        open={showPopup}
                                        content={popupContent}
                                        cancelButton="Cancel"
                                        confirmButton="Sure, I want to delete it !"
                                        onCancel={handleCancel}
                                        onConfirm={handleConfirm}
                                    />
                                </Card.Description>
                            </Card.Content>
                    </Card>
                    )
                })}
            </Card.Group>
        </Segment>
    )
}
