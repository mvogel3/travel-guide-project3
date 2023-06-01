CREATE TABLE HOTEL (
	Hotel_Id SERIAL PRIMARY KEY,
	Hotel_Name	VARCHAR (255) NOT NULL,
	Address VARCHAR (255) NOT NULL,
	Street_Name	VARCHAR (255) NOT NULL,
	City VARCHAR (32) NOT NULL,
	State VARCHAR (32) NOT NULL,
	Zipcode VARCHAR (5) NOT NULL,
	State_Code VARCHAR (3) NOT NULL,
	Longitude VARCHAR (32) NOT NULL,
	Latitude VARCHAR (32) NOT NULL,
	Subway_Name VARCHAR (128) NOT NULL,
	Operator VARCHAR (128) NOT NULL,
	Network VARCHAR (128) NOT NULL,
	Wheelchair VARCHAR (32) NOT NULL,
	Station VARCHAR (32) NOT NULL,
	Check_In Date NOT NULL,
	Check_Out Date NOT NULL,
	Advertised_Price VARCHAR (32) NOT NULL,
	Total_Price VARCHAR (32) NOT NULL,
	Rating VARCHAR (32) NOT NULL,
	Reviews INT NOT NULL,
	entertainment VARCHAR (255) NOT NULL,
	housenumber VARCHAR (32) NOT NULL,
	street VARCHAR (255) NOT NULL,
	address2 VARCHAR (255) NOT NULL,
	Average_Advertised_Price FLOAT NOT NULL,
	Average_Total_Price FLOAT NOT NULL
);
