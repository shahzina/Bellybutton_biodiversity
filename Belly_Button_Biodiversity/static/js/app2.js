function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var sample_content = d3.select("#selDataset").node().value;

    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json('metadata/' + sample_content).then((data) => {
      var div_meta = d3.select('#sample-metadata');
      // Use `.html("") to clear any existing metadata
      contents = '';

      // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
      Object.entries(data).forEach(function([key, value], index){
        contents = contents + `${key} : ${value} <br>`;
      });

      div_meta.html(contents);

    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sample_content = d3.select("#selDataset").node().value;

    // @TODO: Build a Bubble Chart using the sample data
    d3.json('samples/' + sample_content).then((data) => {

      //for bubble chart
      var bubble_data = [{
        x: data.otu_ids,
        y: data.sample_values,
        text: data.otu_labels,
        mode: 'markers',
        marker : {
          size: data.sample_values,
          color: data.otu_ids,
        }
      }];

      var layout = {
        title: 'Marker size',
        showlegend: true,
        height: 400,
        width : 400
      };

      Plotly.newPlot('bubble', bubble_data, layout);

    });

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var pie_data = []; //empty list to store data to use in pie chart


    //for loop to iterate thru all observations and get the 3 columns
    for(i=0; i<otu_ids.length; i++){ 
      pie_data.push({
        'id': data.otu_ids[i],
        'value': data.sample_values[i],
        'label': data.otu_labels[i]
      });
    };

    var top_values = pie_data.sort((a,b)=>{
      return b.sample_value - a.sample_value;
    });

    top_values = top_values.slice(0,10);

    console.log(top_values);

    var pieChart = [{
      values: top_values.map(row=> row.value),
      labels: top_values.map(row=> row.id),
      type: 'pie'
    }]

    var layout = {
      height : 400,
      width : 400
    };


    Plotly.newPlot('pie', pieChart, layout);
}

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
