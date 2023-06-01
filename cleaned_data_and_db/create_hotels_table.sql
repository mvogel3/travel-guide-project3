DROP TABLE all_hotels_data;

CREATE TABLE all_hotels_data(
	hotel_name VARCHAR,
	hotel_number VARCHAR,
	hotel_street VARCHAR,
	city VARCHAR,
	postcode VARCHAR,
	advertised_price VARCHAR,
	total_price VARCHAR,
	hotel_rating VARCHAR,
	distance_from_nyc VARCHAR,
	hotel_longitude VARCHAR,
	hotel_latitude VARCHAR,
	transportation_longitude VARCHAR,
	transportation_latitude VARCHAR,
	entertainment_place VARCHAR,
	ent_full_address VARCHAR,
	ent_longitude VARCHAR,
	ent_latitude VARCHAR,
	rating_out_of_10 VARCHAR,
	no_of_reviews VARCHAR, 
	subway_station VARCHAR,
	subway_operator VARCHAR,
	subway_network VARCHAR,
	fully_wheelchair_accessible VARCHAR
);

SELECT * FROM all_hotels_data;