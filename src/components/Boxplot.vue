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
            var dimensions_name = ["Neuroticism", "Extraversion", "Openness", "Agreeableness", "Conscientiousness", "MHI"];
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
                .domain(['', 'N', 'E', 'O', 'A', 'C', 'MHI', '\n'])
                .range([0, width - margin.right]); // valor de right range = denominador da definicao de var center (mais abaixo)

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
                    .call(this.$d3.axisLeft(y))
                    .append("text")
                    .attr("class", "label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".61em")
                    .style("text-anchor", "end")
                    .style("fill", "black")
                    .text("FFM Traits");
                svg.append("g")
                    .attr("transform", `translate(${width - margin.right}, 0)`)
                    .call(this.$d3.axisRight(y_mhi))
                    .append("text")
                    .attr("class", "label")
                    .attr("transform", "rotate(90)")
                    .attr("y", 6)
                    .attr("dy", ".61em")
                    .style("text-anchor", "initial")
                    .style("fill", "black")
                    .text("MHI");

                this.bp_center = (width - margin.right) / (data.length + 1);
                this.bp_width = 35;
                this.bp_y = y;

                var tooltip = this.$d3.select("#boxplot").append("div").attr("class", "tooltip");
            }
            else {
                var svg = this.$d3.select("#boxplot").select("svg").select("g");
                var tooltip = this.$d3.select("#boxplot").select(".tooltip");
            }

            for (let i = 0; i < data.length; i++) {
                if (!this.boxplotExists) {
                    // Show the main vertical line
                    svg.data(data[i])
                        .append("line")
                        .attr("class", `vertical${i}`)
                        .attr("x1", this.bp_center * (i+1))
                        .attr("x2", this.bp_center * (i+1))
                        .attr("y1", i !== data.length - 1 ? y(min[i]) : y_mhi(min[i]))
                        .attr("y2", i !== data.length - 1 ? y(max[i]) : y_mhi(max[i]))
                        .attr("stroke", "black")
                        .style("stroke-dasharray", "5,5");

                    // Show the box
                    svg.data(data[i])
                        .append("rect")
                        .attr("x", this.bp_center * (i+1) - this.bp_width/2)
                        .attr("y", i !== data.length - 1 ? y(q3[i]) : y_mhi(q3[i]))
                        .attr("height", i !== data.length - 1 ? (y(q1[i]) - y(q3[i])) : (y_mhi(q1[i]) - y_mhi(q3[i])))
                        .attr("width", this.bp_width)
                        .attr("stroke", "black")
                        .style("fill", this.$getColor("primary"));

                    // show median, min and max horizontal lines
                    svg.selectAll("toto")
                        .data([min[i], median[i], max[i]])
                        .enter()
                        .append("line")
                        .attr("class", `toto${i}`)
                        .attr("x1", this.bp_center * (i+1) - this.bp_width/2)
                        .attr("x2", this.bp_center * (i+1) + this.bp_width/2)
                        .attr("y1", (d) => i !== data.length - 1 ? y(d) : y_mhi(d))
                        .attr("y2", (d) => i !== data.length - 1 ? y(d) : y_mhi(d))
                        .attr("stroke", "black");
                }
                else {
                    // update vertical axis
                    var vertLine = svg.selectAll(`.vertical${i}`);
                    vertLine.merge(vertLine)
                            .transition()
                            .duration(1000)
                            .delay((d, i) => i * 20)
                            .attr("y1", i !== data.length - 1 ? y(min[i]) : y_mhi(min[i]))
                            .attr("y2", i !== data.length - 1 ? y(max[i]) : y_mhi(max[i]));

                    // update boxes
                    var rects = svg.selectAll("rect").filter((_, index) => index === i);
                    rects.merge(rects)
                        .transition()
                        .duration(1000)
                        .delay((d, i) => i * 20)
                        .attr("y", i !== data.length - 1 ? y(q3[i]) : y_mhi(q3[i]))
                        .attr("height", i !== data.length - 1 ? (y(q1[i]) - y(q3[i])) : (y_mhi(q1[i]) - y_mhi(q3[i])))
                        .attr("width", this.bp_width);
                    
                    // update min, med, max (a.k.a. whiskers)
                    var totos = svg.selectAll(`.toto${i}`);
                    totos.data([min[i], median[i], max[i]])
                        .merge(totos)
                        .transition()
                        .duration(1000)
                        .delay((d, i) => i * 20)
                        .attr("y1", (d) => i !== data.length - 1 ? y(d) : y_mhi(d))
                        .attr("y2", (d) => i !== data.length - 1 ? y(d) : y_mhi(d));
                }
            }
            var boxes = svg.selectAll("rect");
            var self = this; // scope change
            boxes.on("mouseover", function(_, i) {
                self.$d3.select(this)
                    .classed("hovered", true)
                    .transition()
                    .duration(500)
                    .style("stroke-width", "3px");
                self.$d3.selectAll(`.vertical${i}`)
                    .transition()
                    .duration(500)
                    .style("stroke-width", "3px");
                self.$d3.selectAll(`.toto${i}`)
                    .transition()
                    .duration(500)
                    .style("stroke-width", "3px");
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9)
                    .style("padding", "2px")
                    .style("left", (self.$d3.mouse(this)[0] + 350) + "px")
                    .style("top", (self.$d3.mouse(this)[1] + 500) + "px");
                tooltip
                    .html(`
                            <p style="text-align: center; margin-bottom: 5px; border-bottom: 1px solid #000">
                                <b>${dimensions_name[i]}</b>
                            </p>
                            <table class="tg">
                                <tbody>
                                    <tr>
                                        <th class="tg-73oq">Minimum</th>
                                        <th class="tg-3z1b">${min[i]}</th>
                                    </tr>
                                    <tr>
                                        <td class="tg-73oq">Quartile 1</td>
                                        <td class="tg-3z1b">${q1[i]}</td>
                                    </tr>
                                    <tr>
                                        <td class="tg-73oq">Median</td>
                                        <td class="tg-3z1b">${median[i]}</td>
                                    </tr>
                                    <tr>
                                        <td class="tg-73oq">Quartile 3</td>
                                        <td class="tg-3z1b">${q3[i]}</td>
                                    </tr>
                                    <tr>
                                        <td class="tg-73oq">Maximum</td>
                                        <td class="tg-3z1b">${max[i]}</td>
                                    </tr>
                                </tbody>
                            </table>
                    `);
            });
            boxes.on("mouseout", function(_, i) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                self.$d3.select(this)
                    .classed("hovered", false)
                    .transition()
                    .duration(500)
                    .style("stroke-width", "1px");
                self.$d3.selectAll(`.vertical${i}`)
                    .transition()
                    .duration(500)
                    .style("stroke-width", "1px");
                self.$d3.selectAll(`.toto${i}`)
                    .transition()
                    .duration(500)
                    .style("stroke-width", "1px");
            })
            
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

<style lang="scss">
    #boxplot .tooltip {
        position: absolute;
        opacity: 0;
        width: auto;
        height: auto;
        pointer-events: none;
        font-size: 10pt;
        background-color: cornsilk;
        border-radius: 4px;
        padding-left: 2px;
        z-index: 1;
    }
    .tg {
        border-collapse: collapse;
        border-spacing: 0;
        font-size:  12px;
    }
    .tg td {
        border-style: solid;
        border-width: 0px;
        overflow: hidden;
        word-break: normal;
    }
    .tg th {
        border-style: solid;
        border-width: 0px;
        font-weight: normal;
        overflow: hidden;
        word-break: normal;
    }
    .tg .tg-3z1b {
        border-color: #000000;
        text-align: right;
        vertical-align: top;
    }
    .tg .tg-73oq {
        border-color: #000000;
        text-align: left;
        vertical-align: top;
        padding-right: 30px;
    }
</style>