const files = ["ent.json", "hotel.json", "transport.json","hotelbooking.json"]; 

// Function to read the contents of a file
function readFile(file) {
  return fetch(file)
    .then((response) => response.text())
    .then((text) => JSON.parse(text));
}

// Read data files
const dataPromises = files.map((file) => {
  return readFile(file);
});

// Log the info to the HTML console
console.log("Data Promises: ", dataPromises);

Promise.all(dataPromises).then((data) => {
  let ent = data[0];
  let hotel = data[1];
  let transport = data[2];
  let hotelbooking = Data[3];
  // let hotelprices = data[3];
  // let hotelrating = data[4];

  // Accessing the entertainment name and address
  ent.forEach((entertainment) => {
    let entertainmentName = entertainment["name"];
    let entertainmentAddress = entertainment["address_line2"];
    console.log("Entertainment Name:", entertainmentName);
    console.log("Entertainment Address:", entertainmentAddress);
  });

  // Accessing the hotel name and address
  hotel.forEach((hotel) => {
    let hotelName = hotel["name"];
    let hotelAddress = hotel["address_line2"];
    console.log("Hotel Name:", hotelName);
    console.log("Hotel Address:", hotelAddress);
  });

  // Accessing the transportation
  transport.forEach((transportation) => {
    let transName = transportation["name"];
    let transType = transportation["network"];
    let transstation = transportation["station"];
    let transAdd = transportation["address_line2"];
    console.log("name:", transName);
    console.log("network:", transType);
    console.log("station:", transstation);
    console.log("address_line2:", transAdd);
  });

  // // Accessing the hotel prices
  hotelbooking.forEach((hotelBooking) => {
    let hotelName = hotelBooking["Hotel Name"];
    let checkIn = hotelBooking["Check-In Date"];
    let chekcOut = hotelBooking["Check-Out Date"];
    let advPrice = hotelBooking["Advertised Price"];
    let totalPrice = hotelBooking["Total Price"];
    console.log("Hotel Name:", hotelName);
    console.log("Check-In Date:", checkIn);
    console.log("Check-Out Date:", chekcOut);
    console.log("Advertised Price:", advPrice);
    console.log("Total Price:", totalPrice);
  });

  // // Accessing the hotel names and ratings
  // hotelrating.forEach((hotelRating) => {
  //   let hotelName = hotelRating["Hotel Name"];
  //   let rating = hotelRating["Rating"];
  //   console.log("Hotel Name:", hotelName);
  //   console.log("Rating:", rating);
  // });

  // Function to update the table based on user selection
  function updateTable() {
    const selectedHotel = document.getElementById("Hotel Name").value;
    const checkIn = document.getElementById("Check_in Date").value;
    const chekcOut = document.getElementById("Check-out Date").value;

    // Filter data based on selected hotel and date range
    const filteredData = hotelData.filter((hotel) => hotel.name === selectedHotel);
    // Additional filtering based on date range can be applied here

    // Generate table rows with the filtered data
    const table = document.getElementById("data-table");
    table.innerHTML = ""; // Clear previous table content

    // Create table header row
    const headerRow = table.insertRow();
    Object.keys(filteredData[0]).forEach((key) => {
      const th = document.createElement("th");
      th.textContent = key;
      headerRow.appendChild(th);
    });

    // Create table data rows
    filteredData.forEach((hotel) => {
      const row = table.insertRow();
      Object.values(hotel).forEach((value) => {
        const cell = row.insertCell();
        cell.textContent = value;
      });
    });
  }

  // Add event listeners to update the table on user input
  document.getElementById("selHotel").addEventListener("change", updateTable);
  document.getElementById("startDate").addEventListener("change", updateTable);
  document.getElementById("endDate").addEventListener("change", updateTable);

  // Call updateTable initially to populate the table
  updateTable();

  // Populate hotel selection dropdown
  const hotelNames = hotelData.map((hotel) => hotel.name);
  const hotelDropdown = document.getElementById("selHotel");
  hotelNames.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    hotelDropdown.appendChild(option);
  });
});

// entertainment Info display
function panelData(name) {
  readFile(file).then(function (entertainment) {
    let entData = entertainment;
    let metadata = entData.metadata;
    let identifier = metadata.filter((sample) => sample.name.toString() === name)[0]; //name is a key under Json
    let panel = d3.select("#ent-metadata"); //where we want our code to insert the data
    panel.html("");
    Object.entries(identifier).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`); // append the data and 'h6' sets the size of the font under the dropdown
    });

    BonusGauge(identifier.wfreq); // call BonusGauge function with washing frequency data
  });
}

// Bar Plots
function Plots(name) {
  readFile(file).then(function (entertainment) {
    let entData = entertainment;
    let samples = sampleData.samples;
    let identifier = samples.filter((sample) => sample.id === id);
    let filtered = identifier[0];
    let Entertainment = filtered.sample_values.slice(0, 10).reverse();
    let topOTUids = filtered.otu_ids.slice(0, 10).reverse();
    let postcode = filtered.otu_labels.slice(0, 10).reverse();
    let barTrace = {
      x: Entertainment,
      y: postcode.map((object) => "OTU " + object),
      name: OUTlabels,
      type: "bar",
      orientation: "h",
    };
    let barLayout = {
      title: `Top 10 OTUs for Subject ${id}`,
      xaxis: { title: "Sample Values" },
      height: 450,
      width: 400,
    };
    let barData = [barTrace];
    Plotly.newPlot("bar", barData, barLayout);

    // Bubble plot
    let bubbleTrace = {
      x: filtered.otu_ids,
      y: filtered.sample_values,
      mode: "markers",
      marker: {
        size: filtered.sample_values.map((value) => value * 0.5),
        color: filtered.otu_ids,
        colorscale: "Rainbow",
      },
      text: filtered.otu_labels,
    };
    let bubbleData = [bubbleTrace];
    let bubbleLayout = {
      title: `OTUs for Subject ${id}`,
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
      height: 500,
      width: 1000,
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// Build new upon ID change
function optionChanged(id) {
  Plots(id);
  panelData(id);
}

// Test Subject Dropdown and initial function
function init() {
  let dropDown = d3.select("#selDataset");
  let id = dropDown.property("value");
  readFile(file).then(function (data) {
    sampleData = data;
    let names = sampleData.names;
    let samples = sampleData.samples;
    Object.values(names).forEach((value) => {
      dropDown.append("option").text(value);
    });
    panelData(names[0]);
    Plots(names[0]);
  });
}

init(); // initiate every time the user makes a selection under the dropdown menu

// Bonus

function BonusGauge(wfreq, id) {
  let data = [
    {
      type: "indicator",
      mode: "gauge+number+delta",
      value: wfreq,
      gauge: {
        axis: { range: [null, 9], tickwidth: 1, tickcolor: "Portland" },
        bar: { color: "Portland" },
        bgcolor: "white",
        borderwidth: 4,
        bordercolor: "white",
        steps: [
          { range: [0, 1], color: "rgba(0, 128, 0, .1)" },
          { range: [1, 2], color: "rgba(0, 128, 0, .2)" },
          { range: [2, 3], color: "rgba(0, 128, 0, .3)" },
          { range: [3, 4], color: "rgba(0, 128, 0, .4)" },
          { range: [4, 5], color: "rgba(0, 128, 0, .5)" },
          { range: [5, 6], color: "rgba(0, 128, 0, .6)" },
          { range: [6, 7], color: "rgba(0, 128, 0, .7)" },
          { range: [7, 8], color: "rgba(0, 128, 0, .8)" },
          { range: [8, 9], color: "rgba(0, 128, 0, .9)" },
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 490,
        },
      },
      number: {
        suffix: "Scrubs per Week",
        font: { size: 14 },
      },
    },
  ];
  let layout = {
    title: { text: "Belly Button Washing Frequency" },
    margin: { t: 25, r: 25, l: 25, b: 25 },
    paper_bgcolor: "white",
    font: { color: "black", family: "Arial" },
  };

  Plotly.newPlot("gauge", data, layout);
}
