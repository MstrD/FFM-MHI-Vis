<template>
    <q-page class="q-pl-lg" id="parallel">
        <h5><strong>NEO-FFI Traits</strong></h5>
        <q-page id="chart">
        </q-page>
    </q-page>
</template>

<script>
export default {
    name: 'Parallel',
    data() {
        return {
            parallelExists: false,
            parallelData: null
        }
    },
    methods: {
        drawParallel(data) {
            // set the dimensions and margins of the graph
            var margin = {top: 30, right: 10, bottom: 10, left: 0},
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
        
            // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
            var dimensions = ["Neuroticismo_NEOFFI", "Extroversão_NEOFFI", "AberturaExperiência_NEOFFI",
                        "AmabIilidade_NEOFFI", "Conscienciosidade_NEOFFI"];
        
            var dimensions_name = ["Neuroticism", "Extraversion", "Openness", "Agreeableness", "Conscientiousness"];
        
            // For each dimension, I build a linear scale. I store all in a y object
            var y = {}
                for (let i in dimensions) {
                name = dimensions[i];
                y[name] = this.$d3.scaleLinear()
                    .domain( [0, 48] )
                    .range([height, 0])
            }
        
            // Build the X scale -> it find the best position for each Y axis
            var x = this.$d3.scalePoint()
                .range([0, width])
                .padding(1)
                .domain(dimensions);
            var self = this;
            // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
            function path(d) {
                return self.$d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
            }

            if (!this.parallelExists) {
                // append the svg object to the body of the page
                var svg = this.$d3.select("#parallel").select("#chart")
                    .append("svg")
                        .attr("class", "chart-container")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                        .attr("transform",
                            "translate(" + margin.left + "," + margin.top + ")");

                // Draw the lines
                svg
                    .selectAll("myPath")
                    .data(data)
                    .enter().append("path")
                    .attr("d", path)
                    .attr("class", "target")
                    .style("fill", "none")
                    .style("opacity", 0)
                    .transition()
                    .duration(1000)
                    .style("stroke", "#69b3a2")
                    .style("opacity", 0.5); // TODO: highlight subject when hovering line
            
                // Draw the axis:
                svg.selectAll("myAxis")
                    // For each dimension of the dataset I add a 'g' element:
                    .data(dimensions).enter()
                    .append("g")
                    .attr("class", "myAxis")
                    // I translate this element to its right position on the x axis
                    .attr("transform", (d) => "translate(" + x(d) + ")")
                    // And I build the axis with the call function
                    .each(function(d) { return self.$d3.select(this).call(self.$d3.axisLeft().scale(y[d]));})
                    // Add axis title
                    .append("text")
                        .style("text-anchor", "middle")
                        .attr("y", -9)
                        .text((_, i) => dimensions_name[i])
                        .style("fill", "black")
                        .style("font-weight", "bold");
            }
            else {
                var svg = this.$d3.select("#parallel").select("#chart").select("svg").select("g");
                var myPath = svg.selectAll(".target").data(data);
                myPath.exit().remove();
                if (data.length > this.parallelData.length)
                    myPath.enter()
                        .append("path")
                        .attr("d", path)
                        .attr("class", "target")
                        .style("fill", "none")
                        .style("opacity", 0)
                        .merge(myPath)
                        .transition()
                        .duration(1000)
                        .style("stroke", "#69b3a2")
                        .style("opacity", 0.5);
                else
                    myPath.enter().merge(myPath)
                        .transition()
                        .duration(1000)
                        .attr("d", path);
            }
            if (!this.parallelExists)
                this.parallelExists = true;
            this.parallelData = data;
        },
        highlightParallel(subj) {
            this.$d3.select("#parallel").select("svg").selectAll(".target:not(.highlighted)")
            .filter((d) => this.$getNumber(subj) !== this.$getNumber(d))
            .transition()
            .duration(500)
            .style("opacity", 0.1);
        
            this.$d3.select("#parallel").select("svg").selectAll(".target")
            .filter((d) => this.$getNumber(subj) === this.$getNumber(d))
            .classed("highlighted", true)
            .transition()
            .duration(500)
            .style("opacity", 0.75)
            .style("stroke-width", "3px");
            // TODO: it would be pretty cool if the only values shown in the axes were the ones from the subject
        },
        dehighlightParallel(subj) {
            this.$d3.select("#parallel").select("svg").selectAll(".target.highlighted")
            .filter((d) => this.$getNumber(subj) === this.$getNumber(d))
            .classed("highlighted", false)
            .transition()
            .duration(500)
            .style("opacity", 0.5)
            .style("stroke-width", "1px")
            .style("stroke", "#69b3a2");
            //this.dehighlightAllParallel();
        },
        dehighlightAllParallel() {
            this.$d3.select("#parallel").select("svg").selectAll(".target")
            .transition()
            .duration(500)
            .style("opacity", 0.5)
            .style("stroke-width", "1px")
            .style("stroke", "#69b3a2");
        }
    },
    mounted() {
        this.$root.$on('drawParallel', (data) => this.drawParallel(data));
        this.$root.$on('highlightParallel', (subj) => this.highlightParallel(subj));
        this.$root.$on('dehighlightParallel', (subj) => this.dehighlightParallel(subj));
        this.$root.$on('dehighlightAllParallel', () => this.dehighlightAllParallel());
    }
}
</script>