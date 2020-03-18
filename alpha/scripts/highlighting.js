function highlightSubject(subj) {
    d3.select("#parallel").select("svg").selectAll(".target:not(.highlighted)")
      .filter((d) => getNumber(subj) != getNumber(d))
      .transition()
      .duration(500)
      .style("opacity", 0.2);
  
    d3.select("#parallel").select("svg").selectAll(".target")
      .filter((d) => getNumber(subj) == getNumber(d))
      .classed("highlighted", true)
      .transition()
      .duration(500)
      .style("opacity", 0.75)
      .style("stroke", "white") 
      .style("stroke-width", 3);
      // TODO: it would be pretty cool if the only values shown in the axes were the ones from the subject

    d3.select("#histogram").select("#chart").select("svg")
      .selectAll(".bar")
      .filter((d) => !d.includes(subj))
      .transition()
      .duration(1000)
      .style("opacity", 0.5);

    d3.select("#boxplot").select("svg").select("g")
      .selectAll(".myInd")
      .data(bp_data(subj)).enter()
      .append("line")
      .attr("class", "myInd")
      .attr("x1", (_, i) => bp_center * (i+1) - bp_width/2)
      .attr("x2", (_, i) => bp_center * (i+1) + bp_width/2)
      .attr("y1", (d) => bp_y(d))
      .attr("y2", (d) => bp_y(d))
      .style("stroke", "blue");
  
    showUserInfo(subj);
}
  
function dehighlightSubject(subj) {
    d3.select("#parallel").select("svg").selectAll(".target.highlighted")
      .filter((d) => getNumber(subj) == getNumber(d))
      .classed("highlighted", false)
      .transition()
      .duration(500)
      .style("opacity", 0.5)
      .style("stroke-width", 1)
      .style("stroke", "#69b3a2");

    d3.select("#histogram").select("#chart").select("svg")
      .selectAll(".bar")
      .filter((d) => !d.includes(subj))
      .transition()
      .duration(1000)
      .style("opacity", 1);

    d3.select("#boxplot").select("svg").select("g")
      .selectAll(".myInd")
      .transition()
      .duration(1000)
      .style("opacity", 0)
      .remove();

    hideUserInfo(subj);
    removeHeatmap();
}
  
function dehighlightAllSubjects() {
    d3.select("#parallel").select("svg").selectAll(".target")
      .transition()
      .duration(500)
      .style("opacity", 0.5)
      .style("stroke-width", 1)
      .style("stroke", "#69b3a2");
  
    hideUserInfo();
}
  
function showUserInfo(d) {
    d3.select("#parallel").select("#user_info").style("display", "inherit").append("div").attr("id", "list" + getNumber(d)).html( 
      "<b>Subject:</b> #" + getNumber(d) + ";</br>" + 
      "<b>Age:</b> " + getAge(d) + ";</br>" +
      "<b>Gender:</b> " + getGender(d) + ";</br>" +
      "<b>Residence:</b> " + getResidence(d) + ";</br>" +
      "<b>Schooling Level:</b> " + getSchooling(d) + ";</br>" +
      "<b>Work Status:</b> " + getWorkStatus(d) + ";</br>" +
      "<b>Economical Status:</b> " + getEconomicalStatus(d) + ";</br>" +
      "<b>Marital Status:</b> " + getMaritalStatus(d) + ";</br>" +
      "<b>Household:</b> " + getHousehold(d) + ";</br>" +
      "<b>Religion:</b> " + getReligion(d) + ";</br>");
      drawHeatmap(d);
}
  
function hideUserInfo(d) {
    if (!d) {
      d3.select("#parallel").select("#user_info").select("#list").remove();
      d3.select("#parallel").select("#user_info").style("display", "none");
    }
    else {
      d3.select("#parallel").select("#user_info").select("#list" + getNumber(d)).remove();
      // TODO: remove #user_info when there are no more subjects selected
    }
}