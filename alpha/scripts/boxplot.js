function drawBoxplot(d) {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
  
    // append the svg object to the body of the page
    var svg = d3.select("#boxplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
  
    // create dummy data
    //var data = [12,19,11,13,12,22,13,4,15,16,18,19,20,12,11,9]
    var data = [[], [], [], [], []];
    d.forEach((el) => {
      data[0].push(el.Neuroticismo_NEOFFI);
      data[1].push(el.Extroversão_NEOFFI);
      data[2].push(el.AberturaExperiência_NEOFFI);
      data[3].push(el.AmabIilidade_NEOFFI);
      data[4].push(el.Conscienciosidade_NEOFFI);
    });
    // Compute summary statistics used for the box:
    // https://www.d3-graph-gallery.com/graph/boxplot_basic.html
    var data_sorted = data;
    var q1 = [], median = [], q3 = [], interQuantileRange = [], min = [], max = [];
    data_sorted.forEach((el) => {
      el.sort(d3.ascending);
      q1.push(d3.quantile(el, .25));
      median.push(d3.quantile(el, .5));
      q3.push(d3.quantile(el, .75));
    });
    for (let i = 0; i < q1.length; i++) {
      interQuantileRange.push(q3[i] - q1[i]);
      min.push(q1[i] - 1.5 * interQuantileRange[i]);
      max.push(q1[i] + 1.5 * interQuantileRange[i]);
    }
  
    // Show the X scale
    var x = d3.scalePoint()
      .domain(['', 'Neuroticism', 'Extraversion', 'Openness', 'Agreeableness', 'Conscientiousness'])
      .range([0, width - margin.left - margin.right]); // valor de right range = denominador da definicao de var center (mais abaixo)
  
    svg
      .append("g")
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom(x));
  
    // Show the Y scale
    var y = d3.scaleLinear()
      .domain([0,48])
      .range([height, 0]);
    
    svg
      .append("g")
      .call(d3.axisLeft(y));
  
    // a few features for the box
    var center = (width - margin.left - margin.right) / data.length;
    var width = 50;
  
    for (let i = 0; i < data.length; i++) {
      // Show the main vertical line
      svg
        .append("line")
        .attr("x1", center * (i+1))
        .attr("x2", center * (i+1))
        .attr("y1", y(min[i]))
        .attr("y2", y(max[i]))
        .attr("stroke", "black");
  
      // Show the box
      svg
        .append("rect")
        .attr("x", center * (i+1) - width/2)
        .attr("y", y(q3[i]))
        .attr("height", (y(q1[i]) - y(q3[i])))
        .attr("width", width)
        .attr("stroke", "black")
        .style("fill", "#69b3a2");
  
      // show median, min and max horizontal lines
      svg
        .selectAll("toto")
        .data([min[i], median[i], max[i]])
        .enter()
        .append("line")
        .attr("x1", center * (i+1) - width/2)
        .attr("x2", center * (i+1) + width/2)
        .attr("y1", function(d){ return(y(d))})
        .attr("y2", function(d){ return(y(d))})
        .attr("stroke", "black");
    }
}