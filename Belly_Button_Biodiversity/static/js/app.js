function buildMetadata(sample) {

    d3.json(`metadata/${sample}`).then((data) => {
      var PANEL = d3.select('#sample-metadata');
      PANEL.html("");

      
      Object.entries(data).forEach(([key, value])=>{
        PANEL.append("h6").text(`${key}: ${value}`);
      });

      buildGauge(data.WFREQ);
    });
    
}

function buildCharts(sample) {

    d3.json(`samples/${sample}`).then((data) => {
      const otu_ids = data.otu_ids;
      const otu_labels = data.otu_labels;
      const sample_values = data.sample_values;

      //for bubble chart
      var bubble_data = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker : {
          size: sample_values,
          color: otu_ids,
        }
      }];

      var layout = {
        title: 'Marker size',
        showlegend: true,
        // height: 400,
        // width : 600
      };

      Plotly.plot('bubble', bubble_data, layout);

    

    var pieData = [
     {
       values: sample_values.slice(0, 10),
       labels: otu_ids.slice(0, 10),
       hovertext: otu_labels.slice(0, 10),
       hoverinfo: "hovertext",
       type: "pie"
     }
   ];

   var pieLayout = {
     margin: { t: 0, l: 0 }
   };
    
    Plotly.plot('pie', pieData, pieLayout);
  });
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
