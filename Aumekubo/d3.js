//javascript

from config import geoapify_key
const url = "https://api.geoapify.com/v2/places";

// Set the parameters for the API request
const latitude = 40.7128;
const longitude = -74.0060;
const categories = "accommodation";
const bias = `proximity:${longitude},${latitude}`;
const apiKey = geoapify_key;

// Set up the parameters object
const params = {
  categories: categories,
  limit: 500,
  bias: bias,
  apiKey: apiKey
};

// Build the API URL with the parameters
const apiUrl = new URL(url);
Object.keys(params).forEach(key => apiUrl.searchParams.append(key, params[key]));

// Fetch the JSON data and console log it
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Call your functions or perform further processing with the data here
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });
