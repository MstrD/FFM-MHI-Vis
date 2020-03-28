<template>
    <q-page class="q-pl-lg" id="heatmap">
        <h5><strong>Heatmap</strong></h5>
    </q-page>
</template>

<script>
export default {
    name: 'Heatmap',
    props: {},
    methods: {
        drawHeatmap(d) {
            // set the dimensions and margins of the graph
            var margin = {top: 30, right: 30, bottom: 30, left: 30},
            width = 450 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;
        
            var bgColor = this.$d3.select("#heatmap").style("background-color");
        
            var questions = this.$getTraitQuestions();
            var myGroups = ["Neuroticism", "Extraversion", "Openness", "Agreeableness", "Conscientiousness"]
            //var myGroups = ["N", "E", "O", "A", "C"];
            var myVars = [];
            for (let i = 0; i < questions.neuroticism.length; i++) {
            myVars.push("#" + String(i+1));
            }
            var answers = this.$getTraitAnswers(d);
        
            var svg = this.$d3.select("#heatmap").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
            // Build X scales and axis:
            var x = this.$d3.scaleBand()
            .range([ 0, width ])
            .domain(myVars)
            .padding(0.01);
            svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(this.$d3.axisBottom(x));
        
            // Build Y scales and axis:
            var y = this.$d3.scaleBand()
            .range([ 0, height ])
            .domain(myGroups)
            .padding(0.01);
            svg.append("g")
            .call(this.$d3.axisLeft(y));
        
            // Color scale to use
            const colorScale = this.$d3.scaleLinear()
            .domain([0, 4])
            .range(["lightgreen", "green", "darkgreen"]);
            
            // Append title
            svg.append("text")
            .attr("class", "title")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .text("Heatmap for subject #" + d.Nº);
        
            const cards = svg.selectAll()
            .data(answers);
            
            cards.enter()
            .append("rect")
            .attr("x", (d) => x("#" + String(d.question + 1)))
            .attr("y", (d) => y(d.trait))
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", bgColor)
            .merge(cards)
                .transition()
                .duration(1000)
                .attr("value", (d) => d.value)
                .style("fill", (d) => d.value !== "" ? colorScale(d.value) : bgColor)
        
            // TODO: linha de heatmap para o MHI
        },
        removeHeatmap() {
            if (this.$d3.select("#heatmap").select("svg"))
                this.$d3.select("#heatmap").select("svg").remove();
        }
    },
    mounted() {
        this.$root.$on('drawHeatmap', (d) => this.drawHeatmap(d));
        this.$root.$on('removeHeatmap', () => this.removeHeatmap());
    }
}
</script>