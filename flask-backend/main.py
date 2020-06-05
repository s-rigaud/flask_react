from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
db = SQLAlchemy()
db.init_app(app)


class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    rating = db.Column(db.Integer)

    def to_json(self):
        return {"id": self.id, "title": self.title, "rating": self.rating}


@app.route("/add_movie", methods=["POST"])
def add_movie():
    movie_data = request.get_json()

    new_movie = Movie(title=movie_data["title"], rating=movie_data["rating"])

    db.session.add(new_movie)
    db.session.commit()

    return new_movie.id, 200


@app.route("/movies")
def movies():
    movie_list = Movie.query.all()
    movies = []

    for movie in movie_list:
        print(movie.__dict__)
        movies.append(movie.to_json())

    return jsonify({"movies": movies})


@app.route("/movie/<int:id_>", methods=["GET"])
def movie_get(id_: int):
    """Return movies tag every time due to front end requirements"""
    movie = Movie.query.get(id_)
    if movie:
        movie = movie.to_json()

    return jsonify({"movie": movie})


@app.route("/movie/<int:id_>", methods=["POST"])
def movie_post(id_: int):
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
    """Return movies tag every time due to front end requirements"""
    movie = Movie.query.get(id_)
    if movie:
        db.session.delete(movie)
        db.session.commit()
        return jsonify({"movie": None})
    return "Movie not existing", 404


if __name__ == "__main__":
    app.run(debug=True)
