let url = "http://127.0.0.1:5000/api/v1.0/hotels";
d3.json(url).then(function(hoteldata) {
    console.log(hoteldata);
});

let myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 13
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Initialize the dashboard at start up 
function initialize() {

    let dropdownMenu = d3.select("#selDataset");
    dropdownMenu.append("option").text("All Hotels").property("value", "*")
    d3.json(url).then((hoteldata) => {
        hoteldata.forEach((hotel) => {
            dropdownMenu.append("option")
                .text(hotel.name)
                .property("value", hotel.name);
            L.marker(hotel.location, {
                title: hotel.name
            }).addTo(myMap);
        });
        let hotel_sel = "*";

        buildMetadata(hotel_sel);
        buildMap(hotel_sel);

    });
};

function buildMap(hotel_sel) {
    console.log(`selected hotel: ${hotel_sel}`);
    d3.json(url).then((hoteldata) => {

        // Creating a new marker:
        // We pass in some initial options, and then add the marker to the map by using the addTo() method.
        if (hotel_sel == '*') {
            /*hoteldata.forEach((hotel) => {
                console.log(hotel.location)
                L.marker(hotel.location, {
                    title: hotel.name
                }).addTo(myMap);
            });*/
        } else {
            let hotel = hoteldata.filter(hotel => hotel.name == hotel_sel);
            L.marker(hotel.location, {
                title: hotel.name
            }).addTo(myMap);
        }

    });
};

function buildMetadata(hotel_sel) {
    console.log(`selected hotel: ${hotel_sel}`);
    if (hotel_sel == '*') {
        d3.select("#sample-metadata").html("");
    } else {
        d3.json(url).then((hoteldata) => {
            console.log(`selected hotel: ${hotel_sel}`);
            console.log(hoteldata);
            let hotel = hoteldata.filter(hotel => hotel.name == hotel_sel);
            console.log(`selected hotel: ${hotel}`);
            console.log(`selected hotel name: ${hotel.name}`);
            d3.select("#sample-metadata").html("");
            d3.select("#sample-metadata").append("h5").text(`name: ${hotel.name}`);
            d3.select("#sample-metadata").append("h5").text(`address: ${hotel.address}`);
        });
    }
};


function optionChanged(hotel_sel) {
    console.log(`selected sample: ${hotel_sel}`);
    buildMetadata(hotel_sel);
    buildMap(hotel_sel);
};

initialize();