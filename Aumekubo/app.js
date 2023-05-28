//Use the D3 library to read in samples.json from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending - placeholder for the data
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);


// Demographic Info display 
function panelData(id) {
    d3.json(url).then(function (data) {
        let hoteldata = hdata;
        let metadata = sampleData.metadata;
        let identifier = metadata.filter(sample =>
            sample.id.toString() === id)[0]; //id is a key under Json sample data provided
        let panel = d3.select('#sample-metadata'); //where we want our code to insert the data
        panel.html('');
        Object.entries(identifier).forEach(([key, value]) => {
            panel.append('h6').text(`${key}: ${value}`); // append the data and 'h6' sets the size of the font under the dropdown
        })

        BonusGauge(identifier.wfreq); // call BonusGauge function with washing frequency data
    })
};

//Bar Plots
function Plots(id) {
    d3.json(url).then(function (data) {
        let sampleData = data;
        let samples = sampleData.samples;
        let identifier = samples.filter(sample => sample.id === id);
        let filtered = identifier[0];
        let TopOTU = filtered.sample_values.slice(0, 10).reverse();
        let topOTUids = filtered.otu_ids.slice(0, 10).reverse();
        let OUTlabels = filtered.otu_labels.slice(0, 10).reverse();
        let barTrace = {
            x: TopOTU,
            y: topOTUids.map(object => 'OTU ' + object),
            name: OUTlabels,
            type: 'bar',
            orientation: 'h'
        };
        let barLayout = {
            title: `Top 10 OTUs for Subject ${id}`,
            xaxis: { title: 'Sample Values' },
            height: 450,
            width: 400
        };
        let barData = [barTrace];
        Plotly.newPlot('bar', barData, barLayout);

        //Bubble plot
        let bubbleTrace = {
            x: filtered.otu_ids,
            y: filtered.sample_values,
            mode: 'markers',
            marker: {
                size: filtered.sample_values.map(value => value *.5),
                color: filtered.otu_ids,
                colorscale: 'Rainbow'
            },

            
            text: filtered.otu_labels,
        };
        let bubbleData = [bubbleTrace];
        let bubbleLayout = {
            title: `OTUs for Subject ${id}`,
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Values' },
            height: 500,
            width: 1000
        };

    
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    })
};

//Build new upon ID change
function optionChanged(id) {
    Plots(id);
    panelData(id);
};

//Test Subject Dropdown and initial function
function init() {
    let dropDown = d3.select('#selDataset');
    let id = dropDown.property('value');
    d3.json(url).then(function (data) {
        sampleData = data;
        let names = sampleData.names;
        let samples = sampleData.samples;
        Object.values(names).forEach(value => {
            dropDown.append('option').text(value);
        })
        panelData(names[0]);
        Plots(names[0])
    })
};

init(); //initiate every time the user makes a selection under the dropdown menu

//Bonus

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
            { range: [8, 9], color: "rgba(0, 128, 0, .9)" }

          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: 490
          }
        },
        number: {
          suffix: "Scrubs per Week",
          font: { size: 14 }
        },
      }
    ];
    let layout = {
      title: {text: "Belly Button Washing Frequency"},
      margin: {t: 25, r: 25, l: 25, b: 25},
      paper_bgcolor: "white",
      font: { color: "black", family: "Arial" }
    };

    Plotly.newPlot("gauge", data, layout);
};

