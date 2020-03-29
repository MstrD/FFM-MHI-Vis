<template>
    <q-page class="q-pl-lg q-ma-xs" id="scatter">
        <h5 class="q-mt-xl q-ma-xs"><strong>Scatter Plot</strong></h5>
        <div class="q-gutter-sm">
            <q-radio v-model="scatterIndex" val="Neuroticism" label="Neuroticism" />
            <q-radio v-model="scatterIndex" val="Extraversion" label="Extraversion" />
            <q-radio v-model="scatterIndex" val="Openness" label="Openness" />
            <q-radio v-model="scatterIndex" val="Agreeableness" label="Agreeableness" />
            <q-radio v-model="scatterIndex" val="Conscientiousness" label="Conscientiousness" />
            <q-radio v-model="scatterIndex" val="MHI" label="MHI" />
        </div>
    </q-page>
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
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
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
            
            // setup fill color
            var cValue = (d) => d.Q1_Sexo,
            color = this.$d3.scaleOrdinal(this.$d3.schemeCategory10);

            // don't want dots overlapping axis, so add in buffer to data domain
            if (data.length > 1)
                xScale.domain([this.$d3.min(data, xValue), this.$d3.max(data, xValue)]).nice();
            else
                xScale.domain([18, 76]).nice();
            yScale.domain([0, trait === "MHI" ? 30 : 48]).nice();
            
            if (!this.scatterExists) {
                var svg = this.$d3.select("#scatter").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var tooltip = this.$d3.select("#scatter").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

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
                    .attr("dy", ".71em")
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
                    .style("fill", color);

                var dots = svg.selectAll(".dot")
                    .data(data);
                dots.exit().remove();
                if (data.length > this.scatterData.length)
                    dots.enter()
                        .append("circle")
                        .attr("class", "dot")
                        .attr("r", 3.5)
                        .merge(dots)
                        .transition()
                        .duration(1000)
                        .attr("cx", xMap)
                        .attr("cy", yMap)
                        .style("fill", (d) => color(cValue(d)));
                else
                    dots.enter().merge(dots)
                        .transition()
                        .duration(1000)
                        .attr("cx", xMap)
                        .attr("cy", yMap)
                        .style("fill", (d) => color(cValue(d)));
            }
            var self = this; // scope changes in mouse events; this line is necessary
            dots.on("mouseover", function (d) {
                self.$d3.select(this)
                .transition()
                .duration(500)
                .attr("r", 7);
                tooltip.transition()
                .duration(200)
                .style("opacity", 0.9)
                .style("padding", "2px");
                tooltip.html("<b>Subject #" + d.Nº + "</b><br/> Age: " + xValue(d) + "<br>" + trait + ": " + yValue(d))
                .style("left", (self.$d3.mouse(this)[0] + 80) + "px")
                .style("top", (self.$d3.mouse(this)[1] + 130) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition()
                .duration(500)
                .style("opacity", 0);
                self.$d3.select(this)
                .transition()
                .duration(500)
                .attr("r", 3.5);
            })
            .on("click", function(d) {
                if (self.$d3.select(this).style("stroke") === "none") {
                    self.$d3.select(this).style("stroke", "black");
                    self.$highlightSubject(d);
                }
                else {
                    self.$d3.select(this).style("stroke", "none");
                    self.$dehighlightSubject(d);
                }
            });

            // update "backend" values
            if (!this.scatterExists)
                this.scatterExists = true;
            this.scatterData = data;
        }
    },
    mounted() {
        this.$root.$on('drawScatter', (data) => this.drawScatter(data, this.scatterIndex));
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
        height: 65px;
        pointer-events: none;
        font-size: 10pt;
        background-color: $secondary;
        border-radius: 4px;
        padding-left: 2px;
    }
</style>