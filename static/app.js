// Plotly-Challenge

// create function to chart plots
function buildPlots(id) {

    // use D3 to parse JSON data
    d3.json("samples.json").then((data) => {
      console.log(data)
  
      // prepare data for charts
      // filter metadata by id
      var samples = data.samples.filter(s => s.id === id)[0];
      console.log(samples)
      
      // get top 10 sample values
      var topSamples = samples.sample_values.slice(0, 10).reverse();
      console.log(topSamples);
     
      // get top 10 otu ids
      var topIDs = samples.otu_ids.slice(0, 10).reverse();
      console.log(topIDs);
  
      // change the top 10 otu id's to the required format
      var idOtu = topIDs.map(d => "OTU " + d);
      console.log(`OTU IDS: ${idOtu}`);
  
      // get the top 10 labels
      var topLabels = samples.otu_labels.slice(0, 10).reverse();
      console.log(`Top 10 Sample Values: ${topSamples}`);
      console.log(`Top 10 Id Values: ${topIDs}`);
  
      // get wash frequency
      var metaData = data.metadata;
      var result = metaData.filter(meta => meta.id == id)[0];
      console.log(result)  
      var wFreq= result.wFreq;
      console.log(wFreq);
  
     
      // Bar Chart
      // create trace for bar
      var trace1 = {
        type:"bar",
        orientation: "h",
        x: topSamples,
        y: idOtu,
        text: topLabels
      };
  
      // create array
      var data1 = [trace1];
  
      // define layout
      var layout1 = {
        title: "Top 10 OTU IDs",
        font:{
          family: "Arial"
        },
        xaxis:{ title: "Sample Count" },
        yaxis:{
          title: "OTU IDs",
          tickmode: "linear"
        },
        bargap: 0.2
  
      };
        
      // Plot the chart to a div tag with id "bar"
      Plotly.newPlot("bar", data1, layout1);
  
  
      // Bubble Chart
      // create trace2 for bubble
      var trace2 = {
        type: "bubble",
        mode: "markers",
        text: samples.otu_labels,
        x: samples.otu_ids,
        y: samples.sample_values,
        marker: {
          size: samples.sample_values,
          color: samples.otu_ids,
          colorscale: "Earth",
          sizeref: 2.0 * Math.max(samples.sample_values) / (40**2),
          sizemin: 5
        }
      };
        
      var data2 = [trace2];
  
      var layout2 = {
        title: "OTU ID vs. Count",
        xaxis: { title: "OTU ID"},
              yaxis: { title: "Sample Count"}, 
        showlegend: false,
        height: 800,
        width: 1200
      };
  
      Plotly.newPlot("bubble", data2, layout2);
  
      // BONUS
      // Gauge Chart
      // create trace 3 for gauge chart
      var trace3 = [
        {
          domain: {x: [0,1], y: [0,1]},        
          type: "indicator",
          mode: "gauge",
          value: wFreq,
          title: { text: "<b>Belly Button Washing Frequency</b><br><i>Scrubs per Week</i>", color: "#444444", font: { size: 24 } },
          gauge: {
            shape: "angular",//pointer
            axis: { range: [0, 9]},
            bar: { color: "#FF0000" },//pointer color
            bgcolor: "#ffffff",//gauge bg color         
            steps: [
              { range: [0, 1], color: "#8FBC8F" },
              { range: [1, 2], color: "#98FB98" },
              { range: [2, 3], color: "#90EE90" },
              { range: [3, 4], color: "#9ACD32" },
              { range: [4, 5], color: "#6B8E23" },
              { range: [5, 6], color: "#808000" },
              { range: [6, 7], color: "#008000" },
              { range: [7, 8], color: "#228B22" },
              { range: [8, 9], color: "#32CD32" }
            ],
            threshold: {
              line: { color: "#850000", width: 4 },
              thickness: 0.75,
              value: 9
            }
          }
        }
      ];
      
      var data3 = [trace3];
  
      var layout3 = {
        // title: "Belly Button Washing Frequency",
        width: 600,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
       
        font: { color: "#000000", family: "Arial" }
      };
    
      //Chart not displaying properly
     // Plotly.newPlot("gauge", data3, layout3);
    });
  }
  
  
  // Metadata Table 
  function getData(id) {

    // use D3 to parse JSON data
    d3.json("samples.json").then((data) => {  
      
      var metaData = data.metadata;
      console.log(metaData);
    
      // filter Metadata info by id
      var result = metaData.filter(meta => meta.id == id)[0];
      console.log(result)
  
      // select demographic data
      var panelInfo = d3.select("#sample-metadata");
      
      // empty the demographic info
      panelInfo.html("");
  
      // get demographic data
      Object.entries(result).forEach(([key, value]) => {   
              panelInfo.append("h5").text(key.toUpperCase() + ": " + value);    
      });
    });
  }
  
  // create the function for the change event
  function optionChanged(id) {
    buildPlots(id);
    getData(id);
  }
  
  
  //Dropdown Menu
  
  // create function
  function init() {
  
    // select dropdown menu 
    var dropdown = d3.select("#selDataset"); 
  
    // read the data 
    d3.json("samples.json").then((data) => {
        console.log(data)
  
        // get ids for dropdwown menu
        data.names.forEach((name) => {
            dropdown.append("option").text(name).property("value");
        });
  
        // display data
        buildPlots(data.names[0]);
        getData(data.names[0]);
    });
  }
  
  init();