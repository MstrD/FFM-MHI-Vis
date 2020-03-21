function drawScatter(data, trait) {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    // setup x 
    var xValue = (d) => d.Q2_Idade, // data -> value
    xScale = d3.scaleLinear().range([0, width]), // value -> display
    xMap = (d) => xScale(xValue(d)), // data -> display
    xAxis = d3.axisBottom(xScale);
  
    // setup y
    var yValue = (d) => { // data -> value
        switch (trait) {
            case 'Neuroticism':
                return d.Neuroticismo_NEOFFI;
            case 'Extraversion':
                return d.Extroversão_NEOFFI;
            case 'Openness':
                return d.AberturaExperiência_NEOFFI;
            case 'Agreeableness':
                return d.AmabIilidade_NEOFFI;
            case 'Conscientiousness':
                return d.Conscienciosidade_NEOFFI;
            case 'MHI':
                return d.MH5_total;
        }
    }, 
    yScale = d3.scaleLinear().range([height, 0]), // value -> display
    yMap = (d) => yScale(yValue(d)), // data -> display
    yAxis = d3.axisLeft(yScale);
  
    // setup fill color
    var cValue = (d) => d.Q1_Sexo,
    color = d3.scaleOrdinal(d3.schemeCategory10);

    // don't want dots overlapping axis, so add in buffer to data domain
    if (data.length > 1)
        xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]).nice();
    else
        xScale.domain([18, 76]).nice();
    yScale.domain([0, trait === "MHI" ? 30 : 48]).nice();
    
    if (!scatterExists) {
        var svg = d3.select("#scatter").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var tooltip = d3.select("#scatter").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // x-axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Age");

        // y-axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(trait);

        // draw dots
        var dots = svg.selectAll(".dot")
            .data(data);

        dots.exit().remove();
        
        dots = dots.enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", (d) => color(cValue(d)));

        // draw legend
        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

        // draw legend colored rectangles
        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        // draw legend text
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text((d) => d == 1 ? 'Male' : 'Female');
    }
    else {
        var svg = d3.select("#scatter").select("svg");
        var tooltip = d3.select("#scatter").select(".tooltip");
        
        svg.selectAll(".x.axis")
            .transition()
            .duration(1000)
            .call(xAxis);
        
        svg.selectAll(".y.axis")
            .transition()
            .duration(1000)
            .call(yAxis)
            .select(".label")
            .text(trait);

        svg.selectAll(".legend")
            .transition()
            .duration(1000)
            .style("fill", color);

        var dataFiltered = els.filter((d) => data.includes(d));
        console.log(dataFiltered);
        if (dataFiltered.length > scatterData.length) {
            // FIXME: this code bugs when this condition applies; why?
            // P.S.: blame the transitions!
        }

        var dots = svg.selectAll(".dot")
            .data(dataFiltered);

        dots.exit().remove();
            
        dots.enter().merge(dots)
            .transition()
            .duration(1000)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", (d) => color(cValue(d)));
    }

        dots.on("mouseover", function (d) {
            d3.select(this)
            .transition()
            .duration(500)
            .attr("r", 7);
            tooltip.transition()
            .duration(200)
            .style("opacity", 0.7)
            .style("width", "auto")
            .style("padding", "2px");
            tooltip.html("<b>Subject #" + d.Nº + "</b><br/> Age: " + xValue(d) + "<br>" + trait + ": " + yValue(d))
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition()
            .duration(500)
            .style("opacity", 0);
            d3.select(this)
            .transition()
            .duration(500)
            .attr("r", 3.5);
        })
        .on("click", function(d) {
            if (d3.select(this).style("stroke") === "none") {
              d3.select(this).transition().duration(500).style("stroke", "white");
              highlightSubject(d);
            }
            else {
              d3.select(this).transition().duration(500).style("stroke", "none");
              dehighlightSubject(d);
            }
        });

        // update "backend" values
        if (!scatterExists)
            scatterExists = true;
        scatterData = data;
        if (trait !== scatterIndex)
            scatterIndex = trait;
}