<template>
    <q-page class="q-pl-lg" id="boxplot">
        <h5><strong>Boxplot</strong></h5>
    </q-page>
</template>

<script>
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
                d.Conscienciosidade_NEOFFI
            ]
        }
    },
    methods: {
        drawBoxplot(d) {
            // set the dimensions and margins of the graph
            var margin = {top: 10, right: 30, bottom: 30, left: 40},
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
        
            // append the svg object to the body of the page
            var svg = this.$d3.select("#boxplot")
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
            // Compute summary statistics used for the box:
            // https://www.d3-graph-gallery.com/graph/boxplot_basic.html
            var data_sorted = data;
            var q1 = [], median = [], q3 = [], interQuantileRange = [], min = [], max = [];
            data_sorted.forEach((el) => {
            el.sort(this.$d3.ascending);
            q1.push(this.$d3.quantile(el, .25));
            median.push(this.$d3.quantile(el, .5));
            q3.push(this.$d3.quantile(el, .75));
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
        
            svg
            .append("g")
            .attr("transform", "translate(0, " + height + ")")
            .call(this.$d3.axisBottom(x));
        
            // Show the Y scale
            var y = this.$d3.scaleLinear()
            .domain([0,48])
            .range([height, 0]);
            
            svg
            .append("g")
            .call(this.$d3.axisLeft(y));
        
            // a few features for the box
            if (!this.boxplotExists) {
                this.bp_center = (width - margin.left - margin.right) / data.length;
                this.bp_width = 50;
                this.bp_y = y;
            }
        
            for (let i = 0; i < data.length; i++) {
            // Show the main vertical line
            svg
                .append("line")
                .attr("x1", this.bp_center * (i+1))
                .attr("x2", this.bp_center * (i+1))
                .attr("y1", y(min[i]))
                .attr("y2", y(max[i]))
                .attr("stroke", "black");
        
            // Show the box
            svg
                .append("rect")
                .attr("x", this.bp_center * (i+1) - this.bp_width/2)
                .attr("y", y(q3[i]))
                .attr("height", (y(q1[i]) - y(q3[i])))
                .attr("width", this.bp_width)
                .attr("stroke", "black")
                .style("fill", "#69b3a2");
        
            // show median, min and max horizontal lines
            svg
                .selectAll("toto")
                .data([min[i], median[i], max[i]])
                .enter()
                .append("line")
                .attr("x1", this.bp_center * (i+1) - this.bp_width/2)
                .attr("x2", this.bp_center * (i+1) + this.bp_width/2)
                .attr("y1", function(d){ return(y(d))})
                .attr("y2", function(d){ return(y(d))})
                .attr("stroke", "black");
            }
            if (!this.boxplotExists)
                this.boxplotExists = true;
        },
        highlightBoxplot(subj) {
            this.$d3.select("#boxplot").select("svg").select("g")
            .selectAll(".myInd")
            .data(this.bp_data(subj)).enter()
            .append("line")
            .attr("class", "myInd")
            .attr("x1", (_, i) => this.bp_center * (i+1) - this.bp_width/2)
            .attr("x2", (_, i) => this.bp_center * (i+1) + this.bp_width/2)
            .attr("y1", (d) => this.bp_y(d))
            .attr("y2", (d) => this.bp_y(d))
            .style("stroke", "blue");
        },
        dehighlightBoxplot() {
            this.$d3.select("#boxplot").select("svg").select("g")
            .selectAll(".myInd")
            .transition()
            .duration(1000)
            .style("opacity", 0)
            .remove();
        }
    },
    mounted() {
        this.$root.$on('drawBoxplot', (data) => this.drawBoxplot(data));
        this.$root.$on('highlightBoxplot', (subj) => this.highlightBoxplot(subj));
        this.$root.$on('dehighlightBoxplot', () => this.dehighlightBoxplot());
    }
}
</script>