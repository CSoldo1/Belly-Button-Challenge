function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
// Deliverable 1: 2. Use d3.json to load the samples.json file
// Deliverable 1: 3. Create a variable that holds the samples array.
// Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
// Deliverable 1: 5. Create a variable that holds the first sample in the array.
// Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
// Deliverable 1: 7. Create the yticks for the bar chart.
        // Hint: Get the the top 10 otu_ids and map them in descending order 
        // so the otu_ids with the most bacteria are last. 
// Deliverable 1: 8. Create the trace for the bar chart. 
// Deliverable 1: 9. Create the layout for the bar chart. 
 // Deliverable 1: 10. Use Plotly to plot the data with the layout. 

function buildCharts(sample) {
   
  d3.json("samples.json").then((data) => {
    console.log(data);

    var samples = data.samples;

    var filteredSamples = samples.filter(x => x.id == sample);

    var firstSample = filteredSamples[0];

    var otu_ids = firstSample.otu_ids;

    var otu_labels = firstSample.otu_labels;

    var sample_values = firstSample.sample_values;

   
    var yticks = otu_ids.slice(0,10).map(x => `otu${x}`).reverse();

  
    var trace = {
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      text: otu_labels.slice(0,10).reverse(),
      orientation: "h",
    };

    var barData = [trace];
   
    
    var barLayout = {
        title: { text: "Top Ten OTUs", font: { size: 24 } },
        width: 500,
        height: 400,
        margin: { t: 40, r: 25, l: 45, b: 25 },
        paper_bgcolor: "lavender",
        font: { color: "darkblue", family: "Arial" }
    };

    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2: 1. Create the trace for the bubble chart.
    // Deliverable 2: 2. Create the layout for the bubble chart.
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.

    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      type: "bubble",
      text: otu_labels,
      hoverinfo: "x+y+text",
      mode: 'markers',
      marker: {size: sample_values, color: otu_ids, colorscale: "Portland", hoverText: otu_labels}
    }];


    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      showlegend: false,
      xaxis: {title: "OTU ID"},
      height: 480,
      width: 1100,
      hovermode: "closest",
      paper_bgcolor: "lavender"
    };

    Plotly.newPlot("bubble",bubbleData,bubbleLayout);


    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    // Deliverable 3: 4. Create the trace for the gauge chart.
    // Deliverable 3: 5. Create the layout for the gauge chart.
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.

    var metadata = data.metadata;
    
    var filteredMetadata = metadata.filter(x => x.id == sample);

    var firstMet = filteredMetadata[0];

    var washFreq = firstMet.wfreq;

    var gaugeData = [{
        type: "indicator",
        mode: "gauge+number",
        value: washFreq,
        title: { text: "Belly Button Washing Frequency <br> Scrubs per Week", font: { size: 24 } },
        gauge: {
          axis: { range: [0, 10], dtick: 2, tickcolor: "darkblue" },
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow"},
            { range: [6, 8], color: "yellowgreen"},
            { range: [8, 10], color: "darkgreen"}],
          }
        }];
    
    var gaugeLayout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Arial" }
    };
    
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
   

  });
};

