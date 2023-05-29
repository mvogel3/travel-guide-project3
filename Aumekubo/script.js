let hotelData; // Declare the hotelData variable

// Function to fetch hotel data from the API
async function fetchHotelData() {
  const apiUrl = "https://api.geoapify.com/v2/places?categories=accommodation&filter=place:51d78dcdee167c52c059a5d22785e3544440f00101f90121af020000000000c0020a92031043697479206f66204e657720596f726b&limit=200&apiKey=4635fdf03d0e48119cef20b98ec64ee2";

  try {
     // Show loading indicator
    showLoadingIndicator();

    const response = await fetch(apiUrl);
    const data = await response.json();

    // Extract the necessary information from the API response
    hotelData = data.features.map(feature => {
      return {
        name: feature.properties.name,
        address: feature.properties.address_line2,
        lon: feature.properties.lon,
        lat: feature.properties.lat
        
      };
    });

    // Populate the hotel select dropdown
    populateHotelSelect(hotelData);
  } catch (error) {
    console.log("Error fetching hotel data:", error);
  } finally {
    // Hide loading indicator
    hideLoadingIndicator();
  }
}

// Function to show loading indicator
function showLoadingIndicator() {
  // Display a loading indicator on the page
  const loadingDiv = d3.select("#loading");
  loadingDiv.style("display", "block");
}

// Function to hide loading indicator
function hideLoadingIndicator() {
  // Hide the loading indicator from the page
  const loadingDiv = d3.select("#loading");
  loadingDiv.style("display", "none");
}


// Function to populate the hotel select dropdown
function populateHotelSelect(hotelData) {
  const hotelSelect = d3.select("#selDataset");

  // Bind data to options
  const options = hotelSelect
    .selectAll("option")
    .data(hotelData)
    .enter()
    .append("option")
    .text(d => d.name);
}

// Function to handle selection change
function optionChanged(selectedValue) {
  const selectedHotel = hotelData.find(hotel => hotel.name === selectedValue);

// Extract the hotel information
const hotelInfo = extractHotelInfo(selectedHotel);

// Update the hotel info display
  updateHotelInfo(selectedHotel);

  // Update the map display
  updateMap(selectedHotel);
}

// Function to update the hotel info display
function updateHotelInfo(hotel) {
  const metadataDiv = d3.select("#master-metadata");

  // Clear previous hotel info
  metadataDiv.html("");

  // Append hotel info
  metadataDiv.append("p").text(`Address: ${hotel.address}`);
  metadataDiv.append("p").text(`Coordinates: ${hotel.lat}, ${hotel.lon}`);

  }

// Function to update the map display
function updateMap(hotel) {
  const mapDiv = d3.select("#map");

  // Clear previous map
  mapDiv.html("");

  // Append a new map using the selected hotel's coordinates
  const mapUrl = `https://maps.google.com/maps?q=${hotel.lat},${hotel.lon}&z=15&output=embed`;
  const iframe = document.createElement("iframe");
  iframe.src = mapUrl;
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.frameborder = "0";

  mapDiv.node().appendChild(iframe);
}

// Fetch hotel data from the API and populate the dropdown
fetchHotelData();

function displayHotelInfo(hotelInfo) {
  var hotelInfoDiv = document.getElementById("hotelInfo");
  hotelInfoDiv.innerHTML = `
    <h2>${hotelInfo.name}</h2>
    <p><strong>Prices:</strong> ${hotelInfo.prices}</p>
    <p><strong>Reviews:</strong> ${hotelInfo.reviews}</p>
    <p><strong>About:</strong> ${hotelInfo.about}</p>
    <p>${hotelInfo.additionalInfo}</p>
    <p>${hotelInfo.amenities}</p>
  `;
}

function extractHotelInfo(hotelData) {
  // Extract the relevant information from the hotel data
  var hotelInfo = {
    name: hotelData.name,
    prices: hotelData.prices,
    reviews: hotelData.reviews,
    about: hotelData.about,
    additionalInfo: hotelData.additionalInfo,
    amenities: hotelData.amenities
    // Add more properties as needed
  };

  return hotelInfo;
}
