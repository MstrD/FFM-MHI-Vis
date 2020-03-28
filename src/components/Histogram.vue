<template>
    <q-page class="q-pl-lg" id="histogram">
        <h5 class="q-ma-xs q-mt-xl"><strong>Histogram</strong></h5>
        <div class="q-gutter-sm">
            <q-radio name="histogramTrait" v-model="histogramTrait" val="Neuroticism" label="Neuroticism" />
            <q-radio name="histogramTrait" v-model="histogramTrait" val="Extraversion" label="Extraversion" />
            <q-radio name="histogramTrait" v-model="histogramTrait" val="Openness" label="Openness" />
            <q-radio name="histogramTrait" v-model="histogramTrait" val="Agreeableness" label="Agreeableness" />
            <q-radio name="histogramTrait" v-model="histogramTrait" val="Conscientiousness" label="Conscientiousness" />
            <q-radio name="histogramTrait" v-model="histogramTrait" val="MHI" label="MHI" />
        </div>
        <q-page id="chart">
        </q-page>
    </q-page>
</template>

<script>
export default {
    name: 'Histogram',
    data() {
        return {
            histogramTrait: 'Neuroticism',
            histogramIndex: 0
        }
    },
    methods: {
        drawHistogram(d, index) {
            // set the dimensions and margins of the graph
            var margin = {top: 10, right: 30, bottom: 30, left: 40},
            width = 600 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

            var limitX = index === 5 ? 30 : 48;
            // set the X ranges
            var x = this.$d3.scaleLinear()
            .domain([0, limitX])
            .rangeRound([0, width]);

            var limits = (k) => {
                let res = [];
                let threshold = k;
                for (let i = 0; i <= limitX; i += threshold)
                    res.push(i);
                return res;
            }

            // set the parameters for the histogram
            var histogram = this.$d3.histogram()
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
                    case 5:
                        return d.MH5_total;
                }
            })
            .domain(x.domain())
            .thresholds(limits(6));

            // set the Y ranges
            var y = this.$d3.scaleLinear()
            .domain([0, this.$d3.max(histogram(d)).length]).nice()
            .range([height, 50]);

            // restricts all ticks in y axis to be integers
            var ticking = (e) => Math.floor(e) !== e ? null : e;
        
            // append the svg object to the body of the page
            // append a 'group' element to 'svg'
            // moves the 'group' element to the top left margin
            if (!this.histogramExists)
                var svg = this.$d3.select("#histogram").select("#chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", 
                        "translate(" + margin.left + "," + margin.top + ")");
            else
                var svg = this.$d3.select("#histogram").select("#chart").select("svg").select("g");

            if (!this.histogramExists) {
                // add the x Axis
                svg.append("g")
                    .attr("class", "xAxis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(this.$d3.axisBottom(x)
                        .tickValues(limits(6)));
                
                // add the y Axis
                svg.append("g")
                    .attr("class", "yAxis")
                    .call(this.$d3.axisLeft(y)
                        .tickFormat(ticking));
                }
            else {
                // merge the x Axis
                svg.selectAll(".xAxis")
                    .transition().duration(1000)
                    .call(this.$d3.axisBottom(x)
                        .tickValues(limits(6)));

                // merge the y Axis
                svg.selectAll(".yAxis")
                    .transition().duration(1000)
                    .call(this.$d3.axisLeft(y)
                        .tickFormat(ticking));
            }
        
            // append the bar rectangles to the svg element
            svg.selectAll("rect")
            .data(this.histogramExists ? (histogram(d).length > this.histogramData.length ? histogram(d) : this.histogramData) : histogram(d))
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", 1)
            .attr("width", (d) => this.$d3.max([x(d.x1) - x(d.x0) - 1, 0]))
            .attr("transform", (d) => "translate(" + x(d.x0) + "," + y(d.length) + ")")
            .merge(svg.selectAll("rect").data(histogram(d)))
                .transition()
                .duration(1000)
            .attr("width", (d) => this.$d3.max([x(d.x1) - x(d.x0) - 1, 0]))
            .attr("transform", (d) => "translate(" + x(d.x0) + "," + y(d.length) + ")")
            .attr("height", (d) => height - y(d.length))
            .style("fill", "#69b3a2");

            // FIXME: this piece of code is commented, in case it is better to show dots instead of changing the opacity
            /* svg.selectAll(".element")
            .data(this.histogramExists ? this.histogramData : histogram(d))
            .enter().append("circle")
            .attr("class", "element")
            .attr("r", 7)
            .attr("cx", (d) => x(d.x1) - (x(d.x1)-x(d.x0))/2)
            .attr("cy", (d) => height - (height - y(d.length))/2)
            .style("fill", "blue")
            .style("opacity", 0)
            .merge(svg.selectAll("circle").data(histogram(d)))
                .transition()
                .duration(1000); */
        
            // append the label of each bar
            svg.selectAll(".label")
            .data(this.histogramExists ? (histogram(d).length > this.histogramData.length ? histogram(d) : this.histogramData) : histogram(d))
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
            .style("font-size", "10pt");

            if (index === 5) { // on MHI display
                svg.selectAll(".bar").data(histogram(d))
                    .exit().remove();
                svg.selectAll(".label").data(histogram(d))
                    .exit().remove();
            }

            if (this.$d3.select("#histogram").select("#chart").select("svg")) {
                this.histogramExists = true;
                this.histogramData = histogram(d);
                this.histogramIndex = index;
            }
        },
        highlightHistogram(subj) {
            this.$d3.select("#histogram").select("#chart").select("svg")
            .selectAll(".bar")
            .filter((d) => !d.includes(subj))
            .transition()
            .duration(1000)
            .style("opacity", 0.5);
        },
        dehighlightHistogram(subj) {
            this.$d3.select("#histogram").select("#chart").select("svg")
            .selectAll(".bar")
            .filter((d) => !d.includes(subj))
            .transition()
            .duration(1000)
            .style("opacity", 1);
        }
    },
    mounted() {
        this.$root.$on('drawHistogram', (data) => this.drawHistogram(data, this.histogramIndex));
        this.$root.$on('highlightHistogram', (subj) => this.highlightHistogram(subj));
        this.$root.$on('dehighlightHistogram', (subj) => this.dehighlightHistogram(subj));
    },
    watch: {
        histogramTrait: function() {
            switch (this.histogramTrait) {
                case 'Neuroticism':
                    this.histogramIndex = 0;
                    break;
                case 'Extraversion':
                    this.histogramIndex = 1;
                    break;
                case 'Openness':
                    this.histogramIndex = 2;
                    break;
                case 'Agreeableness':
                    this.histogramIndex = 3;
                    break;
                case 'Conscientiousness':
                    this.histogramIndex = 4;
                    break;
                case 'MHI':
                    this.histogramIndex = 5;
                    break;
            }
            this.drawHistogram(this.filters.toApply, this.histogramIndex);
        }
    }
}
</script>

<style lang="scss">
    /* .bar {
        fill: $secondary !important;
    } */
</style>