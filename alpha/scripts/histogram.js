function drawHistogram(d, index) {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // set the X ranges
    var x = d3.scaleLinear()
      .domain([0, 48]).nice()
      .rangeRound([0, width]);

    var limits = (k) => {
        let res = [];
        let threshold = k;
        for (let i = 0; i <= 48; i += threshold)
          res.push(i);
        return res;
      }

    // set the parameters for the histogram
    var histogram = d3.histogram()
      .value((d) => { 
        switch (index) {
          case 0:
            return d.Neuroticismo_NEOFFI;
          case 1:
            return d.Extroversão_NEOFFI;
          case 2:
            return d.AberturaExperiência_NEOFFI;
          case 3:
            return d.AmabIilidade_NEOFFI;
          case 4:
            return d.Conscienciosidade_NEOFFI;
        }
       })
      .domain(x.domain())
      .thresholds(limits(6));

    // set the Y ranges
    var y = d3.scaleLinear()
      .domain([0, d3.max(histogram(d)).length]).nice()
      .range([height, 50]);

    // restricts all ticks in y axis to be integers
    var ticking = (e) => Math.floor(e) !== e ? null : e;
  
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    if (!histogramExists)
      var svg = d3.select("#histogram").select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");
    else
       var svg = d3.select("#histogram").select("#chart").select("svg");

    if (!histogramExists) {
      // add the x Axis
      svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
          .tickValues(limits(6)));
    
      // add the y Axis
      svg.append("g")
        .attr("class", "yAxis")
        .call(d3.axisLeft(y)
          .tickFormat(ticking));
    }
    else {
      // merge the x Axis
      svg.selectAll(".xAxis")
        .transition().duration(1000)
        .call(d3.axisBottom(x)
          .tickValues(limits(6)));

      // merge the y Axis
      svg.selectAll(".yAxis")
        .transition().duration(1000)
        .call(d3.axisLeft(y)
          .tickFormat(ticking));
    }
  
    // append the bar rectangles to the svg element
    svg.selectAll("rect")
      .data(histogramExists ? histogramData : histogram(d))
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 1)
      .attr("width", (d) => d3.max([x(d.x1) - x(d.x0) - 1, 0]))
      .attr("transform", (d) => "translate(" + x(d.x0) + "," + y(d.length) + ")")
      .merge(svg.selectAll("rect").data(histogram(d)))
        .transition()
        .duration(1000)
      .attr("transform", (d) => "translate(" + x(d.x0) + "," + y(d.length) + ")")
      .attr("height", (d) => height - y(d.length))
      .style("fill", "#69b3a2");
  
    // append the label of each bar
    svg.selectAll(".label")
      .data(histogramExists ? histogramData : histogram(d))
      .enter().append("text")
      .attr("class", "label")
      .attr("x", 1)
      .attr("transform", (d) => "translate(" + ((x(d.x0) + x(d.x1)+1) / 2) + "," + String(y(d.length) - 10) + ")")
      .merge(svg.selectAll(".label").data(histogram(d)))
        .transition()
        .duration(1000)
      .text((d) => (d.length !== 0 ? d.length : String())) // TODO: tween text
      .attr("transform", (d) => "translate(" + ((x(d.x0) + x(d.x1)+1) / 2) + "," + String(y(d.length) - 10) + ")")
      .style("text-anchor", "middle")
      .style("font-size", "10pt")
      .style("fill", "white");

    if (d3.select("#histogram").select("#chart").select("svg")) {
      histogramExists = true;
      histogramData = histogram(d);
      histogramIndex = index;
    }
}