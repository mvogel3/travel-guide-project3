let url = "http://127.0.0.1:5000/api/v1.0/hotels";
let hotel_detail_url = "http://127.0.0.1:5000/api/v1.0/hotel/";
let rank_url = "http://127.0.0.1:5000/api/v1.0/hotels/ranking/";
let price_change_url = "http://127.0.0.1:5000/api/v1.0/hotels/price-change";

let myMap = L.map("map", {
    center: [40.7350, -74.0059],
    zoom: 12
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let layerGroup = L.layerGroup().addTo(myMap);

// Initialize the dashboard at start up 
function initialize() {

    let dropdownMenu = d3.select("#selDataset");
    dropdownMenu.append("option").text("All Hotels").property("value", "*");
    d3.json(url).then((hoteldata) => {
        hoteldata.forEach((hotel) => {
            dropdownMenu.append("option")
                .text(hotel.name)
                .property("value", hotel.name);
            L.marker(hotel.location, {
                title: hotel.name
            }).addTo(layerGroup);
        });
        let hotel_sel = "*";

        buildMetadata(hotel_sel);
        buildMap(hotel_sel);
    });

    let rankMenu = d3.select("#rankHotels");
    rankMenu.append("option").text("Hotel Reviews").property("value", "reviews");
    rankMenu.append("option").text("Hotel Ratings").property("value", "ratings");
    rankMenu.append("option").text("Average Price").property("value", "price");
    let rank_sel = "reviews";
    showRanking(rank_sel);
    showPriceChange();
};

function buildMap(hotel_sel) {
    console.log(`selected hotel: ${hotel_sel}`);
    layerGroup.clearLayers();
    d3.json(url).then((hoteldata) => {

        // Creating a new marker:
        // We pass in some initial options, and then add the marker to the map by using the addTo() method.
        if (hotel_sel == '*') {
            hoteldata.forEach((hotel) => {
                console.log(hotel.location);
                L.marker(hotel.location, {
                    title: hotel.name
                }).addTo(layerGroup);
            });
        } else {
            let hotel = filterHotel(hotel_sel, hoteldata);
            //let hotel = hoteldata[0]
            console.log(hotel.location);
            L.marker(hotel.location, {
                title: hotel.name
            }).addTo(layerGroup);
            d3.json(hotel_detail_url + hotel_sel).then((hoteldetail) => {
                all_entertainment = hoteldetail.all_entertainment;
                all_entertainment.forEach((entertainment) => {
                    console.log(entertainment.entertainment_place);
                    L.circleMarker(entertainment.location, {
                        fillOpacity: 0.75,
                        color: "white",
                        fillColor: "red"
                    }).bindTooltip(entertainment.entertainment_place).addTo(layerGroup);
                });
            });
        };
    });
};

function buildMetadata(hotel_sel) {
    console.log(`selected hotel: ${hotel_sel}`);
    if (hotel_sel == '*') {
        d3.select("#sample-metadata").html("");
    } else {
        d3.json(hotel_detail_url + hotel_sel).then((hoteldetail) => {
            console.log(`selected hotel: ${hotel_sel}`);
            console.log(hoteldetail);
            console.log(hoteldetail.name);
            d3.select("#sample-metadata").html("");
            d3.select("#sample-metadata").append("h5").text("Name: " + hoteldetail.name);
            d3.select("#sample-metadata").append("h5").text("Address: " + hoteldetail.address);
            d3.select("#sample-metadata").append("h5").text("Reviews: " + hoteldetail.reviews);
            d3.select("#sample-metadata").append("h5").text("Average Price: " + hoteldetail.price);
            d3.select("#sample-metadata").append("h5").text("Nearest Subway: " + hoteldetail.subway);
            d3.select("#sample-metadata").append("h5").text("Nearest Subway Operator: " + hoteldetail.subway_operator);
            d3.select("#sample-metadata").append("h5").text("Wheelchair Accessible: " + hoteldetail.wheelchair);
        });
    }
};

function showRanking(rank_sel) {
    console.log(`selected rank by: ${rank_sel}`);
    d3.select("#hotel-ranking").html("");
    d3.json(rank_url + rank_sel).then((hotelNumber) => {
        let trace = {
            x: hotelNumber.hotel_numbers,
            y: hotelNumber.hotel_names,
            text: hotelNumber.hotel_names,
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: `Top 5 hotels by ${hotelNumber.x_label}`,
            margin: {
                l: 300,
                r: 50,
                b: 50,
                t: 50,
                pad: 4
            }
        };

        Plotly.newPlot("hotel-ranking", [trace], layout)
    });
};

function showPriceChange() {
    d3.json(price_change_url).then((price_changes) => {
        let trace = {
            x: price_changes.months,
            y: price_changes.prices,
            text: price_changes.prices,
            type: "line",
        };

        let layout = {
            title: "Price change over the Year",
            yaxis: {
                title: {
                    text: "Price($)"
                }
            }
        };
        Plotly.newPlot("price-change", [trace], layout)
    });
};

function optionChanged(hotel_sel) {
    console.log(`selected sample: ${hotel_sel}`);
    buildMetadata(hotel_sel);
    buildMap(hotel_sel);
};

function filterHotel(hotel_sel, hoteldata) {
    for (let i = 0; i < hoteldata.length; i++) {
        if (hoteldata[i].name == hotel_sel) {
            return hoteldata[i];
        }
    }
}

initialize();