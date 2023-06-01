CREATE TABLE hotel_booking(
	booking_Id SERIAL PRIMARY KEY,
	check_in Date NOT NULL,
	check_out Date NOT NULL,
	hotel_name	VARCHAR (255) NOT NULL,
	total_price FLOAT NOT NULL
);

