#youtube video with the tutorial: https://www.youtube.com/watch?v=Z1RJmh_OqeA
# activate the virtual env = .\env\Scripts\activate
# Now you can proceed to run the app.py file using the command:python app.py
#https://docs.sqlalchemy.org/en/20/
#heroku login --interactive

from flask import Flask, jsonify, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from amadeus import Client, ResponseError
from amadeus_keys import client_id, client_secret
import pprint


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///project3.db'
db = SQLAlchemy(app)


@app.route('/')
def index():
    # Make the API call to Amadeus and retrieve the points of interest
    amadeus = Client(client_id=client_id, client_secret=client_secret)

    locations = [{'latitude': 40.7128, 'longitude': -74.0060, 'name': 'New York City'},
                {'latitude': 13.023577, 'longitude': 77.642256, 'name': 'Bangalore'},
                {'latitude': 41.42, 'longitude': 2.228208, 'name': 'Barcelona'},
                {'latitude': 52.541755, 'longitude': 13.457198, 'name': 'Berlin'},
                {'latitude': 32.806993, 'longitude': -96.737293, 'name': 'Dallas'},
                {'latitude': 51.520180, 'longitude': -0.061048, 'name': 'London'},
                {'latitude': 48.91, 'longitude': 2.46, 'name': 'Paris'},
                {'latitude': 37.810980, 'longitude': -122.370076, 'name': 'San Francisco'}
                ]
    
    points_of_interest = get_points_of_interest(locations)

    return render_template('index.html', locations=locations, points_of_interest=points_of_interest)


def get_points_of_interest(locations):
    amadeus = Client(client_id=client_id, client_secret=client_secret)
    points_of_interest = []

    try:
        for location in locations:
            response = amadeus.reference_data.locations.points_of_interest.get(
                latitude=location['latitude'],
                longitude=location['longitude']
            )
            points_of_interest.extend(response.data)
 
    except ResponseError as error:
        # Handle the error here
        pass

    return points_of_interest


    try:
        for location in locations:
            response = amadeus.reference_data.locations.points_of_interest.get(
                latitude=location['latitude'],
                longitude=location['longitude']
            )
            points_of_interest.extend(response.data)
 
    except ResponseError as error:
        return jsonify({'error': str(error)})

    return jsonify({'points_of_interest': points_of_interest})


if __name__ == "__main__":
    app.run(debug=True)