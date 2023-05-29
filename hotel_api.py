import numpy as np
import psycopg2
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, desc
from sqlalchemy.orm import scoped_session, sessionmaker

from flask import Flask, jsonify, render_template, make_response

 
engine = create_engine('postgresql+psycopg2://postgres:postgress@127.0.0.1:5432/hotel_db')
Base = automap_base()
Base.prepare(autoload_with=engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.config['DEBUG'] = True
app.config['TEMPLATES_AUTO_RELOAD'] = True

#################################################
# Flask Routes
#################################################

@app.route("/dashboard")
def dashboard():
    response = make_response(render_template('index.html'))
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    return response


@app.route("/api/v1.0/hotels")
def names():
    HOTEL = Base.classes.hotels
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of all hotel names and address"""
    # Query all passengers
    results = session.query(HOTEL.hotel_name, func.max(HOTEL.hotel_latitude), func.max(HOTEL.hotel_longitude)).group_by(HOTEL.hotel_name).all()

    session.close()

    all_hotels = []
    for hotel_name, lat, long in results:
        hotel_info = {}
        hotel_info["name"] = hotel_name
        hotel_info["location"] = [float(lat), float(long)]
        all_hotels.append(hotel_info)
    print(len(all_hotels))
    response = jsonify(all_hotels)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/api/v1.0/hotel/<hotel_name>")
def hotel_details(hotel_name):
    HOTEL = Base.classes.hotels
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of all hotel names and address"""
    # Query all passengers
    results = session.query(HOTEL.hotel_number, HOTEL.hotel_street, HOTEL.city, HOTEL.postcode, HOTEL.total_price, HOTEL.hotel_rating, HOTEL.hotel_latitude, HOTEL.hotel_longitude, HOTEL.subway_station, HOTEL.subway_operator, HOTEL.entertainment_place, HOTEL.ent_full_address, HOTEL.ent_latitude, HOTEL.ent_longitude).filter(HOTEL.hotel_name == hotel_name).all()

    session.close()

    hotel_info = {}
    all_entertainment = []
    first=False
    for hotel_number, hotel_street, city, postcode, total_price, hotel_rating, hotel_latitude, hotel_longitude, subway_station, subway_operator, entertainment_place, ent_full_address, ent_latitude, ent_longitude in results:
        entertainment_info = {}
        if(not first):
            hotel_info["name"] = hotel_name
            hotel_info["address"] = f"{hotel_number}, {hotel_street}, {city}, {postcode}"
            hotel_info["price"] = total_price
            hotel_info["reviews"] = hotel_rating
            hotel_info["wheelchair"] = "yes"
            hotel_info["subway"] = subway_station
            hotel_info["subway_operator"] = subway_operator
            hotel_info["location"] = [float(hotel_latitude), float(hotel_longitude)]
            entertainment_info["entertainment_place"] = entertainment_place
            entertainment_info["ent_full_address"] = ent_full_address
            entertainment_info["location"] = [float(ent_latitude), float(ent_longitude)]
            all_entertainment.append(entertainment_info)
            first=True
        else:
            entertainment_info["entertainment_place"] = entertainment_place
            entertainment_info["ent_full_address"] = ent_full_address
            entertainment_info["location"] = [float(ent_latitude), float(ent_longitude)]
            all_entertainment.append(entertainment_info)

    hotel_info["all_entertainment"] = all_entertainment
    print(len(all_entertainment))
    response = jsonify(hotel_info)
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

