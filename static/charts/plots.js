function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("static/data/samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      //Build Initial Plot
      var Sample1 = sampleNames[0];
      buildMetadata(Sample1)
      buildCharts(Sample1);
  })
}
  
  init();
  
  function optionChanged(newSample) {
      buildMetadata(newSample);
      buildCharts(newSample);
    }
    
    function buildMetadata(sample) {
      d3.json("static/data/samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");
    
        PANEL.html("");
        PANEL.append("h6").text(`ID: ${result.id}`)
        PANEL.append("h6").text(`Ethnicity: ${result.ethnicity}`)
        PANEL.append("h6").text(`Gender: ${result.gender}`)
        PANEL.append("h6").text(`Age: ${result.age}`)
        PANEL.append("h6").text(`Location: ${result.location}`)
        PANEL.append("h6").text(`BB Type: ${result.bbtype}`)
        PANEL.append("h6").text(`W Freq: ${result.wfreq}`);
      });
    }

    // 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/data/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`);
    //DELIVERABLE 1
      // 8. Create the trace for the bar chart. 
      var barData = [{
        y: yticks.reverse(),
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h',
      }];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: "Bacteria Count",
        xaxis: {title: "Count"},
        yaxis: {title: "Bacteria Type"}
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout)
  // DELIVERABLE 2
      // 1. Create the trace for the bubble chart.
      var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values
        }
      }]
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: {text: 'Bacteria Type'},
        xaxis: {title: {text: 'OTU ID Number'}},
        yaxis: {title: {text: 'Sample Values'}},
      }

      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout)

//DELIVERABLE 3
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var WFRQ = result.wfreq.toFixed(2)

      // 4. Create the trace for the gauge chart.
      var gaugeData = [{ 
        domain: {x: [0, 1], y: [0, 1]},
        value: WFRQ,
        title: {text: "Belly Button Washing Frequency"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [null, 10]},
          bar: {color: "black"},
          steps: [
            {range: [0,2], color: "red"},
            {range: [2,4], color: "orange"},
            {range: [4,6], color: "yellow"},
            {range: [6,8], color: "lightgreen"},
            {range: [8,10], color: "darkgreen"},
          ]
        }
      }];

      // 5. Create the layout for the gauge chart.
      var gaugeLayout = {
        width: 600,
        height: 600,
        margin: {t: 0, b: 0}
      };

      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout)

  });
}
