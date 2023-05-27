import numpy as np
import psycopg2
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy.orm import scoped_session, sessionmaker

from flask import Flask, jsonify


engine = create_engine('postgresql+psycopg2://postgres:postgress@127.0.0.1:5432/hotel_db') 
Base = automap_base()
Base.prepare(autoload_with=engine)
HOTEL = Base.classes.hotel

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/api/v1.0/hotels")
def names():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of all hotel names and address"""
    # Query all passengers
    results = session.query(HOTEL.hotel_name, func.max(HOTEL.address), func.max(HOTEL.latitude), func.max(HOTEL.longitude)).group_by(HOTEL.hotel_name).all()

    session.close()

    all_hotels = []
    for hotel_name, address, lat, long in results:
        hotel_info = {}
        hotel_info["name"] = hotel_name
        hotel_info["address"] = address
        hotel_info["location"] = [float(lat), float(long)]
        all_hotels.append(hotel_info)
    print(len(all_hotels))
    response = jsonify(all_hotels)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response



if __name__ == '__main__':
    app.run(debug=True)

