<template>
    <div id="scatter" class="col-12 col-md-7" style="height: 400px">
        <div class="q-mt-md q-pl-md q-gutter-sm">
            <q-radio dense v-model="scatterIndex" val="Neuroticism" label="N" />
            <q-radio dense v-model="scatterIndex" val="Extraversion" label="E" />
            <q-radio dense v-model="scatterIndex" val="Openness" label="O" />
            <q-radio dense v-model="scatterIndex" val="Agreeableness" label="A" />
            <q-radio dense v-model="scatterIndex" val="Conscientiousness" label="C" />
            <q-radio dense v-model="scatterIndex" val="MHI" label="MHI" />
        </div>
    </div>
</template>

<script>
import PageIndex from 'pages/Index';
export default {
    name: 'Scatter',
    components: {
        PageIndex
    },
    data() {
        return {
            scatterIndex: 'MHI',
            scatterExists: false,
            scatterData: null
        }
    },
    methods: {
        drawScatter(data, trait) {
            var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = this.$d3.select("#scatter").property("clientWidth") - margin.left - margin.right,
            height = this.$d3.select("#parallel").property("clientHeight") - margin.top - margin.bottom;
            // setup x 
            var xValue = (d) => d.Q2_Idade, // data -> value
            xScale = this.$d3.scaleLinear().range([0, width]), // value -> display
            xMap = (d) => xScale(xValue(d)), // data -> display
            xAxis = this.$d3.axisBottom(xScale);
        
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
            yScale = this.$d3.scaleLinear().range([height, 0]), // value -> display
            yMap = (d) => yScale(yValue(d)), // data -> display
            yAxis = this.$d3.axisLeft(yScale);
            
            // setup fill color for legend
            var cValue = (d, i) => i !== 1 ? this.$getColor("female") : this.$getColor("male");
            // setup fill color for dots
            var color = (d) => d.Q1_Sexo !== 1 ? this.$getColor("female") : this.$getColor("male");

            // don't want dots overlapping axis, so add in buffer to data domain
            if (data.length > 1)
                xScale.domain([this.$d3.min(data, xValue), this.$d3.max(data, xValue)]).nice();
            else
                xScale.domain([18, 66]).nice();
            yScale.domain([0, trait === "MHI" ? 30 : 48]).nice();
            
            if (!this.scatterExists) {
                var svg = this.$d3.select("#scatter").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var tooltip = this.$d3.select("#scatter").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0)
                tooltip.append("div")
                    .attr("id", "text");
                tooltip.append("div")
                    .attr("id", "chart");

                // x-axis
                svg.append("g")
                    .attr("class", "xAxis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("x", width)
                    .attr("y", -6)
                    .style("text-anchor", "end")
                    .style("fill", "black")
                    .text("Age");

                // y-axis
                svg.append("g")
                    .attr("class", "yAxis")
                    .call(yAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".61em")
                    .style("text-anchor", "end")
                    .style("fill", "black")
                    .text(trait);

                // draw dots
                var dots = svg.selectAll(".dot")
                    .data(data);
                dots.exit().remove();
                dots = dots.enter()
                    .append("circle")
                    .attr("class", "dot")
                    .attr("r", 3)
                    .attr("cx", xMap)
                    .attr("cy", yMap)
                    .style("fill", (d) => color(d));

                // draw legend
                var legend = svg.selectAll(".legend")
                    .data(["Female", "Male"])
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

                // draw legend colored rectangles
                legend.append("rect")
                    .attr("x", width - 18)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", cValue);

                // draw legend text
                legend.append("text")
                    .attr("x", width - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text((d) => d);
            }
            else {
                var svg = this.$d3.select("#scatter").select("g");
                var tooltip = this.$d3.select("#scatter").select(".tooltip");
                
                svg.selectAll(".xAxis")
                    .transition()
                    .duration(1000)
                    .call(xAxis);

                svg.selectAll(".yAxis")
                    .transition()
                    .duration(1000)
                    .call(yAxis)
                    .select(".label")
                    .text(trait);

                svg.selectAll(".legend")
                    .transition()
                    .duration(1000)
                    .style("fill", cValue);

                var dots = svg.selectAll(".dot")
                    .data(data);
                dots.exit().remove();
                if (data.length > this.scatterData.length)
                    dots.enter()
                        .append("circle")
                        .attr("class", "dot")
                        .attr("r", 3)
                        .merge(dots)
                        .transition()
                        .duration(1000)
                        .attr("cx", xMap)
                        .attr("cy", yMap)
                        .style("fill", (d) => color(d));
                else
                    dots.enter().merge(dots)
                        .transition()
                        .duration(1000)
                        .attr("cx", xMap)
                        .attr("cy", yMap)
                        .style("fill", (d) => color(d));
            }
            var self = this; // scope changes in mouse events; this line is necessary
            dots.on("mouseover", function (d) {
                self.$d3.select(this)
                    .classed("hovered", true)
                    .transition()
                    .duration(500)
                    .attr("r", 6)
                    .style("cursor", "pointer");
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9)
                    .style("padding", "2px")
                    .style("left", (self.$d3.mouse(this)[0] + 850) + "px")
                    .style("top", (self.$d3.mouse(this)[1] + 130) + "px");
                tooltip.select("#text")
                    .html("<b>Subject #" + d.Nº + "</b><br/> Age: " + xValue(d) + "<br>" + trait + ": " + yValue(d));
            })
            .on("mouseout", function() {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                if (!self.$d3.select(this).classed("clicked"))
                    self.$d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("r", 3);
            })
            .on("click", function(d) {
                if (!self.$d3.select(this).classed("clicked")) {
                    self.$d3.select(this).classed("clicked", true);
                    self.$d3.select(this)
                        .style("stroke", "black");
                    self.$highlightSubject(d);
                    self.$scatterUsers.push(d);
                }
                else {
                    self.$d3.select(this).classed("clicked", false);
                    self.$d3.select(this)
                        .style("stroke", "none")
                        .transition()
                        .duration(1000)
                        .attr("r", 3);
                    self.$dehighlightSubject(d);
                    self.$scatterUsers = self.$scatterUsers.filter(el => d.Nº !== el.Nº);
                    self.$root.$emit("removeScatterUsers", self.$scatterUsers); // this is hammered, needs to be here for parallel highlighting when v-model changes
                }
            });

            // update "backend" values
            if (!this.scatterExists)
                this.scatterExists = true;
            this.scatterData = data;
        },
        highlightScatter(id) {
            this.dehighlightScatter();
            var dots = this.$d3.select("#scatter").select("g").selectAll(".dot")
                .data(this.$els)
                .filter((d) => d.Nº === id.Nº);
            dots.transition()
                .duration(1000)
                .style("stroke", "black")
                .attr("r", 6);
        },
        dehighlightScatter() {
            var dots = this.$d3.select("#scatter").select("g").selectAll(".dot[r^='6']");
            if (dots.nodes().length)
                dots.transition()
                    .duration(1000)
                    .style("stroke", "none")
                    .attr("r", 3);
        }
    },
    mounted() {
        this.$root.$on('drawScatter', (data) => this.drawScatter(data, this.scatterIndex));
        this.$root.$on('highlightScatter', (id) => this.highlightScatter(id));
        this.$root.$on('dehighlightScatter', () => this.dehighlightScatter());
    },
    watch: {
        scatterIndex: function() {
            this.drawScatter(this.scatterData, this.scatterIndex);
        }
    }
}
</script>

<style lang="scss">
    #scatter .tooltip {
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
</style>