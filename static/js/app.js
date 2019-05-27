function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(data) {
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(function ([key, value]) {
      // Hint: Inside the loop, you will need to use d3 to append new tags for each key-value in the metadata.
      var row = d3.select("#sample-metadata").append("p");
      row.text(`${key}: ${value}`);
});
})
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

function buildCharts(sample) {

    // d3.json(`/samples/${sample}`).then(function(data) {
    //   var trace = {
    //     type: "pie",
    //     labels: data.map(entry => entry.otu_labels),
    //     values: data.map(entry => entry.sample_values),
    //     hovertext: data.map(entry => entry.otu_ids)
    //   }
    //   var layout = { title: "Belly Button Pie Chart" }
    //   Plotly.plot("pie", [trace], layout)
    
    // @TODO: Build a Pie Chart
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(`/samples/${sample}`).then(function(data) {
      // d3.select("#pie").html("");
      // HINT: You will need to use slice() to grab the top 10 sample_values, otu_ids, and labels (10 each).      
      var pie_labels = data.otu_ids.slice(0,10);
      var pie_values = data.sample_values.slice(0,10);
      var pie_hovertext = data.otu_labels.slice(0,10);

      var trace1 = [{
        labels: pie_labels,
        values: pie_values,
        hovertext: pie_hovertext,
        type: 'pie', 
      }];      
      var layout1 = { 
        title: `Belly Button Pie Chart - Sample ${sample}`
        // autosize: true
        // showlegend: true        
      }
      Plotly.plot('pie', trace1, layout1);    
    })

  // @TODO: Build a Bubble Chart using the sample data
    d3.json(`/samples/${sample}`).then(function(data) {
      var x_axis = data.otu_ids;
      var y_axis = data.sample_values;
      var marker_size = data.sample_values;
      var m_colors = data.otu_ids; 
      var t_values = data.otu_labels;
      var trace2 = [{
        x: x_axis,
        y: y_axis,
        text: t_values,
        mode: 'markers',
        marker: {
          color: m_colors,
          size: marker_size,
          colorscale: "RdBu"
        } 
      }];
      var layout2 = {
        title: `Belly Button Bubble Chart - Sample ${sample}`,
        xaxis: { title: "OTU ID"},
      };
      Plotly.newPlot('bubble', trace2, layout2);
});
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
