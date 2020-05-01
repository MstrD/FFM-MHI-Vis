<template>
    <div class="q-mt-md col-12 col-md-5" id="violin" style="height: 400px">
    </div>
</template>

<script>
import { median } from 'd3v4';
export default {
    name: 'Violin',
    data() {
        return {
            violinExists: false,
            violin_y: null,
            violin_center: null,
            violin_width: null,
            violin_data: (d) => [
                d.Neuroticismo_NEOFFI,
                d.Extroversão_NEOFFI,
                d.AberturaExperiência_NEOFFI,
                d.AmabIilidade_NEOFFI,
                d.Conscienciosidade_NEOFFI
            ],
            violinUsers: []
        }
    },
    methods: {
        drawViolin(d) {
            // set the dimensions and margins of the graph
            var margin = {top: 10, right: 30, bottom: 30, left: 40},
                width = this.$d3.select("#violin").property("clientWidth") - margin.left - margin.right,
                height = this.$d3.select("#violin").property("clientHeight") - margin.top - margin.bottom;
        
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
                .domain(['', 'Neuroticism', 'Extraversion', 'Openness', 'Agreeableness', 'Conscientiousness'])
                .range([0, width - margin.left - margin.right]); // valor de right range = denominador da definicao de var center (mais abaixo)
        
            // Show the Y scale
            var y = this.$d3.scaleLinear()
                .domain([0,48])
                .range([height, 0]).nice();

            if (!this.violinExists) {
                // append the svg object to the body of the page
                var svg = this.$d3.select("#violin")
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

                this.violin_center = (width - margin.left - margin.right) / data.length;
                this.violin_width = 50;
                this.violin_y = y;
            }
            else
                var svg = this.$d3.select("#violin").select("svg").select("g");

            var histoChart = this.$d3.histogram()
                .domain([0, 48])
                .value(d => d);
        
            var area = this.$d3.area()
                .x0(d => -d.length/2)
                .x1(d => d.length/2)
                .y(d => y(d.x0))
                .curve(this.$d3.curveCatmullRom);

            svg.selectAll("g.violin")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "violin")
                .attr("transform", (d, i) => `translate(${this.violin_center * (i+1)}, 0)`)
                .append("path")
                .style("stroke", "black")
                .style("fill", this.$getColor("primary"))
                .attr("d", d => area(histoChart(d)))
                .merge(svg.selectAll("g.violin").data(data))
                    .transition()
                    .duration(1000)
                    .select("path")
                    .attr("d", d => area(histoChart(d)));

            for (let i = 0; i < data.length; i++) {
                if (!this.violinExists) {
                    // Show the main vertical line
                    svg.data(data[i])
                        .append("line")
                        .attr("class", "vertical")
                        .attr("x1", this.violin_center * (i+1))
                        .attr("x2", this.violin_center * (i+1))
                        .attr("y1", y(min[i]))
                        .attr("y2", y(max[i]))
                        .attr("stroke", "black");

                    // Show the box
                    svg.data(data[i])
                        .append("rect")
                        .attr("x", this.violin_center * (i+1) - this.violin_width/4)
                        .attr("y", y(q3[i]))
                        .attr("height", (y(q1[i]) - y(q3[i])))
                        .attr("width", this.violin_width/2)
                        .attr("stroke", "black")
                        .style("fill", this.$getColor("secondary"));

                    // show median, min and max horizontal lines
                    svg.selectAll("toto")
                        .data([min[i], median[i], max[i]])
                        .enter()
                        .append("line")
                        .attr("class", "toto")
                        .attr("x1", this.violin_center * (i+1) - this.violin_width/4)
                        .attr("x2", this.violin_center * (i+1) + this.violin_width/4)
                        .attr("y1", (d) => y(d))
                        .attr("y2", (d) => y(d))
                        .attr("stroke", "black");
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
                        .attr("width", this.violin_width/2);
                    
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

            if (!this.violinExists)
                this.violinExists = true;
        },
        highlightViolin(subj) {
            var arc = this.$d3.symbol().type(this.$d3.symbolDiamond); // identifies user with diamond symbol
            
            this.$d3.select("#violin").select("svg").select("g")
                .selectAll(`.myInd${subj.Nº}`)
                .data(this.violin_data(subj)).enter()
                .append("path")
                .attr("d", arc)
                .attr("class", `myInd${subj.Nº}`)
                .attr("transform", (d, i) => `translate(${(this.violin_center * (i+1))}, ${this.violin_y(d)})`)
                .style("fill", "orange")
                .style("stroke", this.$getColor("dark"))
                .style("opacity", 0)
                .transition()
                .duration(1000)
                .style("opacity", 1);

            this.$d3.select("#violin").select("svg").select("g")
                .selectAll(`.myIndLabel${subj.Nº}`)
                //.selectAll(".myIndLabel")
                .data(this.violin_data(subj)).enter()
                .append("text")
                .attr("class", `myIndLabel${subj.Nº}`)
                //.attr("class", "myIndLabel")
                .attr("transform", (d, i) => `translate(${(this.violin_center * (i+1) + 10)}, ${this.violin_y(d)})`)
                .style("font-size", "9pt")
                .style("opacity", 0)
                .transition()
                .duration(1000)
                .style("opacity", 1)
                .text(`#${subj.Nº}`);

            this.violinUsers.push(subj);
        },
        dehighlightViolin(subj) {
            console.log(this);
            this.$d3.select("#violin").select("svg").select("g")
                .selectAll(`.myInd${subj.Nº}`)
                .transition()
                .duration(1000)
                .style("opacity", 0)
                .remove();

            this.$d3.select("#violin").select("svg").select("g")
                .selectAll(`.myIndLabel${subj.Nº}`)
                .transition()
                .duration(1000)
                .style("opacity", 0)
                .remove();

            this.violinUsers = this.violinUsers.filter((d) => d.Nº !== subj.Nº);
        }
    },
    mounted() {
        this.$root.$on('drawViolin', (data) => this.drawViolin(data));
        this.$root.$on('highlightViolin', (subj) => this.highlightViolin(subj));
        this.$root.$on('dehighlightViolin', (subj) => this.dehighlightViolin(subj));
    }
}
</script>