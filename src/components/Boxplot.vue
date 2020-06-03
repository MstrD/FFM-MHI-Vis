<template>
    <div class="q-mt-xl col-12 col-md-4" id="boxplot" style="height: 400px">
    </div>
</template>

<script>
import { median } from 'd3v4';
export default {
    name: 'Boxplot',
    data() {
        return {
            boxplotExists: false,
            bp_y: null,
            bp_center: null,
            bp_width: null,
            bp_data: (d) => [
                d.Neuroticismo_NEOFFI,
                d.Extroversão_NEOFFI,
                d.AberturaExperiência_NEOFFI,
                d.AmabIilidade_NEOFFI,
                d.Conscienciosidade_NEOFFI,
                d.MH5_total
            ]
        }
    },
    methods: {
        drawBoxplot(d) {
            // set the dimensions and margins of the graph
            var margin = {top: 10, right: 30, bottom: 30, left: 40},
                width = this.$d3.select("#boxplot").property("clientWidth") - margin.left - margin.right,
                height = this.$d3.select("#boxplot").property("clientHeight") - margin.top - margin.bottom;
        
            // create dummy data
            var data = [[], [], [], [], [], []];
            d.forEach((el) => {
                data[0].push(el.Neuroticismo_NEOFFI);
                data[1].push(el.Extroversão_NEOFFI);
                data[2].push(el.AberturaExperiência_NEOFFI);
                data[3].push(el.AmabIilidade_NEOFFI);
                data[4].push(el.Conscienciosidade_NEOFFI);
                data[5].push(el.MH5_total);
            });
            // Compute summary statistics used for the box:
            // https://www.d3-graph-gallery.com/graph/boxplot_basic.html
            var data_sorted = data;
            var q1 = [], median = [], q3 = [], interQuantileRange = [], min = [], max = [];
            data_sorted.forEach((el) => {
                el.sort(this.$d3.ascending);
                q1.push(this.$d3.quantile(el, 0.25));
                median.push(this.$d3.quantile(el, 0.5));
                q3.push(this.$d3.quantile(el, 0.75));
            });
            for (let i = 0; i < q1.length; i++) {
                interQuantileRange.push(q3[i] - q1[i]);
                min.push(q1[i] - 1.5 * interQuantileRange[i]);
                max.push(q1[i] + 1.5 * interQuantileRange[i]);
            }
        
            // Show the X scale
            var x = this.$d3.scalePoint()
                .domain(['', 'N', 'E', 'O', 'A', 'C', 'MHI'])
                .range([0, width - margin.left - margin.right]); // valor de right range = denominador da definicao de var center (mais abaixo)

            // Show the Y scale
            var y = this.$d3.scaleLinear()
                .domain([0,48])
                .range([height, 0]).nice();

            var y_mhi = this.$d3.scaleLinear()
                .domain([0, 30])
                .range([height, 0]).nice();
        
            // a few features for the box
            if (!this.boxplotExists) {
                var svg = this.$d3.select("#boxplot")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
                svg
                    .append("g")
                    .attr("transform", "translate(0, " + height + ")")
                    .call(this.$d3.axisBottom(x));
                svg
                    .append("g")
                    .call(this.$d3.axisLeft(y));
                svg.append("g")
                    .attr("transform", `translate(${width - margin.right}, 0)`)
                    .call(this.$d3.axisRight(y_mhi));
                this.bp_center = (width - margin.left - margin.right) / data.length;
                this.bp_width = 35;
                this.bp_y = y;
            }
            else
                var svg = this.$d3.select("#boxplot").select("svg").select("g");

            for (let i = 0; i < data.length; i++) {
                if (!this.boxplotExists) {
                    // Show the main vertical line
                    svg.data(data[i])
                        .append("line")
                        .attr("class", "vertical")
                        .attr("x1", this.bp_center * (i+1))
                        .attr("x2", this.bp_center * (i+1))
                        .attr("y1", y(min[i]))
                        .attr("y2", y(max[i]))
                        .attr("stroke", "black")
                        .style("stroke-dasharray", "5,5");

                    // Show the box
                    svg.data(data[i])
                        .append("rect")
                        .attr("x", this.bp_center * (i+1) - this.bp_width/2)
                        .attr("y", y(q3[i]))
                        .attr("height", (y(q1[i]) - y(q3[i])))
                        .attr("width", this.bp_width)
                        .attr("stroke", "black")
                        .style("fill", this.$getColor("primary"));

                    // show median, min and max horizontal lines
                    svg.selectAll("toto")
                        .data([min[i], median[i], max[i]])
                        .enter()
                        .append("line")
                        .attr("class", "toto")
                        .attr("x1", this.bp_center * (i+1) - this.bp_width/2)
                        .attr("x2", this.bp_center * (i+1) + this.bp_width/2)
                        .attr("y1", (d) => y(d))
                        .attr("y2", (d) => y(d))
                        .attr("stroke", "black");
                    
                    // append tooltip for each rect
                    svg.data(data[i])
                        .append("div")
                        .attr("class", "tooltip")
                        .attr("transform", (d, i) => `translate(${this.bp_center * (i+1) - this.bp_width/2}, ${y(d)})`)
                        .style("opacity", 0.75)
                        .append("text")
                        .text((_, i) => `Trait ${i+1}`)
                }
                else {
                    // update vertical axis
                    var vertLine = svg.selectAll(".vertical").filter((_, index) => index === i);
                    vertLine.enter().merge(vertLine)
                        .transition()
                        .duration(1000)
                        .delay((d, i) => i * 20)
                        .attr("y1", y(min[i]))
                        .attr("y2", y(max[i]));

                    // update boxes
                    var rects = svg.selectAll("rect").filter((_, index) => index === i);
                    rects.enter().merge(rects)
                        .transition()
                        .duration(1000)
                        .delay((d, i) => i * 20)
                        .attr("y", y(q3[i]))
                        .attr("height", (y(q1[i]) - y(q3[i])))
                        .attr("width", this.bp_width);
                    
                    // update min, med, max (a.k.a. whiskers)
                    var totos = svg.selectAll(".toto").filter((_, index) => index >= i * 3 && index < (i+1) * 3);
                    totos.data([min[i], median[i], max[i]])
                        .enter().merge(totos)
                        .transition()
                        .duration(1000)
                        .delay((d, i) => i * 20)
                        .attr("y1", (d) => y(d))
                        .attr("y2", (d) => y(d));
                }
            }
            
            if (!this.boxplotExists)
                this.boxplotExists = true;
        },
        highlightBoxplot(subj) {
            var arc = this.$d3.symbol().type(this.$d3.symbolDiamond); // identifies user with diamond symbol
            
            this.$d3.select("#boxplot").select("svg").select("g")
                .selectAll(`.myInd${this.$getNumber(subj)}`)
                .data(this.bp_data(subj)).enter()
                .append("path")
                .attr("d", arc)
                .attr("class", `myInd${this.$getNumber(subj)}`)
                .attr("transform", (d, i) => `translate(${(this.bp_center * (i+1))}, ${this.bp_y(d)})`)
                .style("fill", "orange")
                .style("stroke", this.$getColor("dark"))
                .style("opacity", 0)
                .transition()
                .duration(1000)
                .style("opacity", 1);

            this.$d3.select("#boxplot").select("svg").select("g")
                .selectAll(`.myIndLabel${this.$getNumber(subj)}`)
                .data(this.bp_data(subj)).enter()
                .append("text")
                .attr("class", `myIndLabel${this.$getNumber(subj)}`)
                .attr("transform", (d, i) => `translate(${(this.bp_center * (i+1) + 10)}, ${this.bp_y(d)})`)
                .style("font-size", "9pt")
                .style("opacity", 0)
                .transition()
                .duration(1000)
                .style("opacity", 1)
                .text(`#${this.$getNumber(subj)}`);
        },
        dehighlightBoxplot(subj) {
            this.$d3.select("#boxplot").select("svg").select("g")
                .selectAll(`.myInd${this.$getNumber(subj)}`)
                .transition()
                .duration(1000)
                .style("opacity", 0)
                .remove();

            this.$d3.select("#boxplot").select("svg").select("g")
                .selectAll(`.myIndLabel${this.$getNumber(subj)}`)
                .transition()
                .duration(1000)
                .style("opacity", 0)
                .remove();
        }
    },
    mounted() {
        this.$root.$on('drawBoxplot', (data) => this.drawBoxplot(data));
        this.$root.$on('highlightBoxplot', (subj) => this.highlightBoxplot(subj));
        this.$root.$on('dehighlightBoxplot', (subj) => this.dehighlightBoxplot(subj));
    }
}
</script>