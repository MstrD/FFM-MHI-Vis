function drawBoxplot(d) {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
  
    // append the svg object to the body of the page
    var svg = d3.select("#violin")
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

    var histoChart = d3.histogram()
        .domain([0, 48])
        .value(d => d);
  
    var area = d3.area()
        .x0(d => -d.length/2)
        .x1(d => d.length/2)
        .y(d => y(d.x0))
        .curve(d3.curveCatmullRom);

    // a few features for the box
    if (!boxplotExists) {
      bp_center = (width - margin.left - margin.right) / data.length;
      bp_width = 50;
      bp_y = y;
    }

    svg.selectAll("g.violin")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(${92 * (i+1)}, 0)`)
        .append("path")
        .style("stroke", "black")
        .style("stroke-width", 2)
        .style("fill", "green")
        .attr("d", d => area(histoChart(d)));

    if (!boxplotExists)
      boxplotExists = true;
}