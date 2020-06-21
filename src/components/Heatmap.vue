<template>
    <div class="q-pl-lg" id="heatmap">
    </div>
</template>

<script>
export default {
    name: 'Heatmap',
    methods: {
        drawHeatmap(d) {
            // set the dimensions and margins of the graph
            var margin = {top: 10, right: 20, bottom: 30, left: 20},
                width = 300 - margin.left - margin.right,
                height = 300 - margin.top - margin.bottom;
        
            var bgColor = this.$d3.select("#scatter").style("background-color");
        
            var questions = this.$getTraitQuestions();
            var myGroups = ["Neuroticism", "Extraversion", "Openness", "Agreeableness", "Conscientiousness"];
            var myGroupsReduced = ["N", "E", "O", "A", "C"];
            var myVars = [];
            for (let i = 0; i < questions.neuroticism.length; i++) {
                myVars.push("#" + String(i+1));
            }
            var answers = this.$getTraitAnswers(d);
            var labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
            
            // heatmap title (subject ID)
            this.$d3.select(".rightDrawer").append("div")
                .attr("class", `q-ml-md q-mt-md title${this.$getNumber(d)}`)
                .html(`<b>Subject ${this.$getNumber(d)}:</b>`);
            // svg (heatmap per se)
            var svg = this.$d3.select(".rightDrawer").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("class", `chart chart${this.$getNumber(d)}`)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            // tooltip for mouse events
            var tooltip = this.$d3.select(".rightDrawer").append("div").attr("class", "tooltip").style("opacity", 0);
        
            // Build X scales and axis:
            var x = this.$d3.scaleBand()
                .range([ 0, width ])
                .domain(myVars)
                .padding(0.01);
                svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(this.$d3.axisBottom(x).tickSize(0));
        
            // Build Y scales and axis:
            var y = this.$d3.scaleBand()
                .range([ 0, height ])
                .domain(myGroupsReduced)
                .padding(0.01);
                svg.append("g")
                .call(this.$d3.axisLeft(y).tickSize(0));
        
            // Color scale to use
            const colorScale = this.$d3.scaleLinear()
                .domain([0, 4])
                .range([this.$getColor("info"), this.$getColor("primary")]);
        
            const cards = svg.selectAll()
                .data(answers);
            
            cards.enter()
                .append("rect")
                .attr("x", (d) => x("#" + String(d.question)))
                .attr("y", (d) => y(d.traitReduced)) // change to y(d.trait) to print full name in y-axis
                .attr("width", x.bandwidth() )
                .attr("height", y.bandwidth() )
                .style("fill", bgColor)
                .merge(cards)
                    .transition()
                    .duration(1000)
                    .attr("value", (d) => d.value)
                    .style("fill", (d) => d.value !== "" ? colorScale(d.value) : bgColor);
            
                // TODO: linha de heatmap para o MHI

            // tooltip events
            var self = this;
            var rects = svg.selectAll("rect");
            rects.on('mouseover', function(d) {
                console.log(d);
                self.$d3.select(this)
                    .transition()
                    .duration(1000)
                    .style("stroke", "black");
                tooltip.html(`
                    <b>Question ${d.question} (${d.traitReduced}):</b>
                    ${self.$getQuestionsVerbose()[d.trait][d.question - 1]}</br>
                    <b>Response:</b>
                    ${d.value} (${labels[d.value]})
                `)
                .transition()
                .duration(1000)
                .style("opacity", 1)
                .style("left", (self.$d3.mouse(this)[0] + 0) + "px")
                .style("top", (self.$d3.mouse(this)[1] + 100) + "px");;
            });
            rects.on('mouseout', function(d) {
                self.$d3.select(this)
                    .transition()
                    .duration(1000)
                    .style("stroke", "none");
                tooltip
                    .transition()
                    .duration(1000)
                    .style("opacity", 0);
            })

            this.$root.$emit('openRightDrawer'); // FIXME: this will become false
        },
        removeHeatmap(d) {
            if (this.$d3.select(".rightDrawer").select(`.chart${this.$getNumber(d)}`)) {
                this.$d3.select(".rightDrawer").select(`.chart${this.$getNumber(d)}`).remove();
                this.$d3.select(".rightDrawer").select(`.title${this.$getNumber(d)}`).remove();
            }
            if (!this.$d3.select(".rightDrawer").select(`.chart`))
                this.$root.$emit('closeRightDrawer');
        }
    },
    mounted() {
        this.$root.$on('drawHeatmap', (d) => this.drawHeatmap(d));
        this.$root.$on('removeHeatmap', (d) => this.removeHeatmap(d));
    }
}
</script>

<style lang="scss" scoped>
    svg g.tick line {
        stroke: none;
        fill: none;
    }
</style>

<style lang="scss">
    .rightDrawer .tooltip {
        margin: 0px 5px;
        padding-left: 5px;
        background: cornsilk;
        border: 1px solid black;
        border-radius: 5px;
        font-size: 9pt;
    }
</style>