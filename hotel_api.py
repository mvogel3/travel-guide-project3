import numpy as np
import psycopg2
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, desc
from sqlalchemy.orm import scoped_session, sessionmaker

from flask import Flask, jsonify, render_template

 
engine = create_engine('postgresql+psycopg2://postgres:postgress@127.0.0.1:5432/hotel_db')
Base = automap_base()
Base.prepare(autoload_with=engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/dashboard")
def dashboard():
    return render_template('index.html')


@app.route("/api/v1.0/hotels")
def names():
    HOTEL = Base.classes.hotel
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of all hotel names and address"""
    # Query all passengers
    results = session.query(HOTEL.hotel_name, func.max(HOTEL.address), func.max(HOTEL.rating), func.max(HOTEL.reviews), func.max(HOTEL.subway_name), func.max(HOTEL.entertainment), func.max(HOTEL.wheelchair), func.max(HOTEL.latitude), func.max(HOTEL.longitude)).group_by(HOTEL.hotel_name).all()

    session.close()

    all_hotels = []
    for hotel_name, address, rating, reviews, subway, entertainment, wheelchair, lat, long in results:
        hotel_info = {}
        hotel_info["name"] = hotel_name
        hotel_info["address"] = address
        hotel_info["rating"] = rating
        hotel_info["reviews"] = reviews
        hotel_info["wheelchair"] = wheelchair
        hotel_info["subway"] = subway
        hotel_info["entertainment"] = entertainment
        hotel_info["location"] = [float(lat), float(long)]
        all_hotels.append(hotel_info)
    print(len(all_hotels))
    response = jsonify(all_hotels)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/api/v1.0/hotels/ranking/<rank_by>")
def rankings(rank_by):
    HOTEL_NUMBERS = Base.classes.hotel_numbers
    results=[]
    x_label=""
    # Create our session (link) from Python to the DB
    session = Session(engine)

    if (rank_by == 'ratings') :
        """Return a list of all hotel names and address"""
        # Query all passengers
        results = session.query(HOTEL_NUMBERS.hotel_name, HOTEL_NUMBERS.rating).order_by(desc(HOTEL_NUMBERS.rating)).limit(10).all()
        x_label = "Ratings"

    elif (rank_by == 'reviews') :
        """Return a list of all hotel names and address"""
        # Query all passengers
        results = session.query(HOTEL_NUMBERS.hotel_name, HOTEL_NUMBERS.reviews).order_by(desc(HOTEL_NUMBERS.reviews)).limit(10).all()
        x_label = "Reviews"
    
    elif (rank_by == 'price') :
        """Return a list of all hotel names and address"""
        # Query all passengers
        results = session.query(HOTEL_NUMBERS.hotel_name, HOTEL_NUMBERS.avg_price).order_by(desc(HOTEL_NUMBERS.avg_price)).limit(10).all()
        x_label = "Average Price"


    session.close()

    ranking_info = {}
    hotels_names = []
    hotels_numbers = []

    for hotel_name, number in results:   
        hotels_names.append(hotel_name)
        hotels_numbers.append(number)
    hotels_names.reverse()
    hotels_numbers.reverse()
    ranking_info["hotel_names"] = hotels_names
    ranking_info["hotel_numbers"] = hotels_numbers
    ranking_info["x_label"] = x_label
    
    response = jsonify(ranking_info)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response



if __name__ == '__main__':
    app.run(debug=True)

