"""
Author: Sam
Goal: Movie backend for test website
"""

import os
import urllib.request

from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from httplib2 import Http

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
db = SQLAlchemy()
db.init_app(app)
USER_AGENTS = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36"
HEADERS = {"user-agent": USER_AGENTS}
http = Http()
FRONTEND_PUBLIC_FOLDER = os.path.join(
    os.path.dirname(__file__), "..", "react-frontend", "public"
)


class Movie(db.Model):
    """DB representation of movie data"""
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    rating = db.Column(db.Integer)

    def to_json(self):
        """Return dict to be parsed into json later"""
        return {"id": self.id, "title": self.title, "rating": self.rating}


def download_cover(movie: Movie):
    """Download picture from google search directly in frontend public folder"""
    url = f"https://www.google.fr/search?tbm=isch&q=movie+cover+{movie.title}"
    _, content = http.request(url, "GET", headers=HEADERS)
    img_url = (
        "https://encrypted"
        + content.split(b'class="l7VXJc pZqGvd j9mU7d"', 1)[1]
        .split(b"https://encrypted", 1)[1]
        .split(b'"', 1)[0]
        .decode()
    )
    file_path = os.path.join(FRONTEND_PUBLIC_FOLDER, f"{movie.id}.png")
    urllib.request.urlretrieve(img_url, file_path)


@app.route("/add_movie", methods=["POST"])
def add_movie():
    """Add movie into DB"""
    movie_data = request.get_json()
    if movie_data and movie_data.get("title") and movie_data.get("rating"):
        title = movie_data["title"]
        rating = int(movie_data["rating"]) % 6

        if rating >= 1:
            new_movie = Movie(title=title, rating=str(rating))
            db.session.add(new_movie)
            db.session.commit()
            download_cover(new_movie)

            return str(new_movie.id), 200
    return "You should provide a title and a rating to register a movie", 400


@app.route("/movies")
def list_movies():
    """List movies from DB"""
    db_movies = Movie.query.all()
    movies = []

    for movie in db_movies:
        movies.append(movie.to_json())

    movies.sort(key=lambda movie: movie['rating'], reverse=True)

    return jsonify({"movies": movies})


@app.route("/movie/<int:id_>", methods=["GET"])
def movie_get(id_: int):
    """Obtain informations for a perticular movie"""
    movie = Movie.query.get(id_)
    if movie:
        movie = movie.to_json()

    return jsonify({"movie": movie})


@app.route("/movie/<int:id_>", methods=["POST"])
def movie_post(id_: int):
    """Change informations for a perticular movie"""
    movie = Movie.query.get(id_)
    if movie:
        body = request.json
        if "id" in body.keys():
            return "You are not allowed to change movie id !", 502

        for key, value in body.items():
            setattr(movie, key, value)
        db.session.commit()
        movie = movie.to_json()
    return jsonify({"movie": movie})


@app.route("/movie/<int:id_>", methods=["DELETE"])
def movie_delete(id_: int):
    """Delete informations for a perticular movie"""
    movie = Movie.query.get(id_)
    if movie:
        db.session.delete(movie)
        db.session.commit()
        file_path = os.path.join(FRONTEND_PUBLIC_FOLDER, f"{id_}.png")
        if os.path.isfile(file_path):
            os.remove(file_path)
        return jsonify({"movie": None})
    return "Movie not existing", 404


if __name__ == "__main__":
    app.run(debug=True)
