<template>
    <div class="col-12 col-md-5" id="parallel" style="height: 375px">
        <div class="q-mt-md q-pl-lg q-gutter-sm">
            <q-radio dense v-model="parallelIndex" val="Individual" label="Individual" />
            <q-radio dense v-model="parallelIndex" val="Grouping" label="Grouping Average" />
        </div>
        <div id="chart">
        </div>
    </div>
</template>

<script>
export default {
    name: 'Parallel',
    data() {
        return {
            parallelExists: false,
            parallelData: null,
            parallelIndex: 'Individual',
            parallelPrevIndex: 'Individual',
            parallelGrouping: null,
            parallelThresholds: null,
            color: this.$d3.scaleOrdinal(this.$d3.schemeCategory10)
        }
    },
    methods: {
        drawParallel(data, parallelIndex) {
            // set the dimensions and margins of the graph
            var margin = {top: 30, right: 10, bottom: 10, left: 0},
            width = this.$d3.select("#parallel").property("clientWidth") - margin.left - margin.right,
            height = this.$d3.select("#parallel").property("clientHeight") - margin.top - margin.bottom;
            if (!this.parallelGrouping)
                this.createGrouping(data);
            // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
            var dimensions = ["Neuroticismo_NEOFFI", "Extroversão_NEOFFI", "AberturaExperiência_NEOFFI",
                        "AmabIilidade_NEOFFI", "Conscienciosidade_NEOFFI", "MH5_total"];
        
            var dimensions_name = ["Neuroticism", "Extraversion", "Openness", "Agreeableness", "Conscientiousness", "MHI"];
        
            // For each dimension, I build a linear scale. I store all in a y object
            var y = {};
            for (let i in dimensions) {
                name = dimensions[i];
                if (name !== "MH5_total") {
                    y[name] = this.$d3.scaleLinear()
                        .domain( parallelIndex === 'Individual' ? [0, 48] : this.parallelThresholds[name])
                        .range([height, 0]);
                    if (parallelIndex !== "Individual")
                        y[name].nice();
                }
                else {
                    y[name] = this.$d3.scaleLinear()
                        .domain( parallelIndex === 'Individual' ? [0, 30] : this.parallelThresholds[name])
                        .range([height, 0]);
                    if (parallelIndex !== "Individual")
                        y[name].nice();
                }
            }
        
            // Build the X scale -> it find the best position for each Y axis
            var x = this.$d3.scalePoint()
                .range([0, width])
                .padding(1)
                .domain(dimensions);
            var self = this;

            // draggable behavior
            var start_x;
            var dragging = {};
            var drag_handler = this.$d3.drag()
                .subject(function(d) { return {x: x(d)}; })
                .on("start", drag_start)
                .on("drag", drag_drag)
                .on("end", drag_end);
            function drag_start(d) {
                dragging[d] = x(d);
            }
            function drag_drag(d) {
                dragging[d] = Math.min(width, Math.max(0, self.$d3.event.x));
                svg.selectAll(".target")
                    .attr("d", path);
                dimensions.sort((a, b) => position(a) - position(b));
                x.domain(dimensions);
                self.$d3.selectAll(".myAxis")
                    .attr("transform", (d) => "translate(" + position(d) + ")");
            }
            function drag_end(d) {
                delete dragging[d];
                self.$d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("transform", "translate(" + x(d) + ")");
                svg.selectAll(".target")
                    .transition()
                    .duration(1000)
                    .attr("d", path);
            }

            function position(d) {
                return dragging[d] == null ? x(d) : dragging[d];
            }

            // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
            function path(d) {
                return self.$d3.line()(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
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
                    .data(this.parallelIndex === 'Individual' ? data : this.parallelGrouping)
                    .enter().append("path")
                    .attr("d", path)
                    .attr("class", "target")
                    .style("fill", "none")
                    .style("opacity", 0)
                    .transition()
                    .duration(1000)
                    .style("stroke", (d, i) => this.choosePainting(d, i))
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
                    .on("mouseenter", function() {
                        self.$d3.select(this).style("cursor", "move");
                    })
                    .call(drag_handler)
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
                var myPath = svg.selectAll(".target").data(this.parallelIndex === 'Individual' ? data : this.parallelGrouping);
                myPath.exit().remove();
                if (this.parallelPrevIndex != parallelIndex)
                    svg.selectAll(".myAxis").each(function(d) { return self.$d3.select(this).transition().duration(1000).call(self.$d3.axisLeft().scale(y[d]));})
                let actual = this.parallelIndex === 'Individual' ? data.length : this.parallelGrouping.length;
                let previous = this.parallelPrevIndex === 'Individual' ? this.parallelData.length : this.parallelGrouping.length;
                if (actual > previous) { // more lines than before
                    if (this.parallelPrevIndex != parallelIndex)
                        myPath.remove();
                    myPath.enter()
                        .append("path")
                        .attr("d", path)
                        .attr("class", "target")
                        .style("fill", "none")
                        .style("opacity", 0)
                        .merge(myPath)
                        .transition()
                        .duration(1000)
                        .style("stroke", (d, i) => this.choosePainting(d, i))
                        .style("opacity", 0.5)
                }
                else // same or less lines than before
                    myPath.enter().merge(myPath)
                        .transition()
                        .duration(1000)
                        .attr("d", path)
                        .style("stroke", (d, i) => this.choosePainting(d, i))
                        .style("stroke-width", (d) => this.parallelIndex === "Individual" ? "1px" : "3px");
            }
            if (!this.parallelExists)
                this.parallelExists = true;
            this.parallelData = data;
            this.parallelPrevIndex = parallelIndex;
        },
        createGrouping(data) {
            // grouping by age is generated here
            var first_grouping = [];
            var grouping = [];
            first_grouping.push(
                data.filter((d) => this.$getAge(d) >= 18 && this.$getAge(d) < 30)
            );
            for (let age = 30; age < 80; age += 10) {
                first_grouping.push(
                    data.filter((d) => this.$getAge(d) >= age && this.$getAge(d) < age + 10)
                );
            }
            first_grouping.forEach(element => {
                let n = 0, e = 0, o = 0, a = 0, c = 0, mhi = 0;
                element.forEach(d => {
                    n += d.Neuroticismo_NEOFFI;
                    e += d.Extroversão_NEOFFI;
                    o += d.AberturaExperiência_NEOFFI;
                    a += d.AmabIilidade_NEOFFI;
                    c += d.Conscienciosidade_NEOFFI;
                    mhi += d.MH5_total;
                });
                grouping.push({
                    Neuroticismo_NEOFFI: n / element.length,
                    Extroversão_NEOFFI: e / element.length,
                    AberturaExperiência_NEOFFI: o / element.length,
                    AmabIilidade_NEOFFI: a / element.length,
                    Conscienciosidade_NEOFFI: c / element.length,
                    MH5_total: mhi / element.length
                });
            });
            this.parallelGrouping = grouping;
            this.getGroupingThresholds(grouping);
        },
        getGroupingThresholds(grouping) {
            let thresholds = {
                Neuroticismo_NEOFFI: [this.$d3.min(grouping, d => d.Neuroticismo_NEOFFI), this.$d3.max(grouping, d => d.Neuroticismo_NEOFFI)],
                Extroversão_NEOFFI: [this.$d3.min(grouping, d => d.Extroversão_NEOFFI), this.$d3.max(grouping, d => d.Extroversão_NEOFFI)],
                AberturaExperiência_NEOFFI: [this.$d3.min(grouping, d => d.AberturaExperiência_NEOFFI), this.$d3.max(grouping, d => d.AberturaExperiência_NEOFFI)],
                AmabIilidade_NEOFFI: [this.$d3.min(grouping, d => d.AmabIilidade_NEOFFI), this.$d3.max(grouping, d => d.AmabIilidade_NEOFFI)],
                Conscienciosidade_NEOFFI: [this.$d3.min(grouping, d => d.Conscienciosidade_NEOFFI), this.$d3.max(grouping, d => d.Conscienciosidade_NEOFFI)],
                MH5_total: [this.$d3.min(grouping, d => d.MH5_total), this.$d3.max(grouping, d => d.MH5_total)]
            };
            this.parallelThresholds = thresholds;
            return thresholds;
        },
        choosePainting(d, i) {
            if (this.parallelIndex === 'Individual') // choose between blue or orange for each of the 200 subjects
                return d.Q1_Sexo !== 1 ? this.$getColor("primary") : "orange";
            else // uses d3.schemeCategory10 (one for each group presented)
                return this.color(i);
        },
        getAgeIndex(age) {
            switch (true) {
                case 18 <= age && age < 30:
                    return 0;
                case 30 <= age && age < 40:
                    return 1;
                case 40 <= age && age < 50:
                    return 2;
                case 50 <= age && age < 60:
                    return 3;
                case 60 <= age && age < 70:
                    return 4;
                case 70 <= age && age < 80:
                    return 5;
            }
        },
        highlightParallel(subj) {
            if (this.parallelIndex === "Individual") {
                this.$d3.select("#parallel").select("#chart").select("svg").selectAll(".target:not(.highlighted)")
                    .filter((d) => this.$getNumber(subj) !== this.$getNumber(d))
                    .transition()
                    .duration(500)
                    .style("opacity", 0.1);
            
                this.$d3.select("#parallel").select("#chart").select("svg").selectAll(".target")
                    .filter((d) => this.$getNumber(subj) === this.$getNumber(d))
                    .classed("highlighted", true)
                    .transition()
                    .duration(500)
                    .style("opacity", 0.75)
                    .style("stroke-width", "3px");
            }
            else {
                let index = this.getAgeIndex(subj.Q2_Idade);
                this.$d3.select("#parallel").select("#chart").select("svg").selectAll(".target:not(.highlighted)")
                    .filter((d, i) => i !== index)
                    .transition()
                    .duration(500)
                    .style("opacity", 0.1)
                    .style("stroke-width", "3px");

                this.$d3.select("#parallel").select("#chart").select("svg").selectAll(".target")
                    .filter((d, i) => i === index)
                    .classed("highlighted", true)
                    .transition()
                    .duration(500)
                    .style("opacity", "0.75")
                    .style("stroke-width", "3px");
            }
        },
        dehighlightParallel(subj) {
            if (this.parallelIndex === "Individual")
                this.$d3.select("#parallel").select("#chart").select("svg").selectAll(".target.highlighted")
                    .filter((d) => this.$getNumber(subj) === this.$getNumber(d))
                    .classed("highlighted", false)
                    .transition()
                    .duration(500)
                    .style("opacity", this.$d3.select("#parallel").select("#chart").select("svg").selectAll(".target.highlighted").data().length ? 0.1 : 0.5)
                    .style("stroke-width", "1px")
                    .style("stroke", (d, i) => this.choosePainting(d, i));
            else {
                let index = this.getAgeIndex(subj.Q2_Idade);
                this.$d3.select("#parallel").select("#chart").select("svg").selectAll(".target")
                    .filter((d, i) => i === index)
                    .classed("highlighted", false)
                    .transition()
                    .duration(500)
                    .style("opacity", this.$d3.select("#parallel").select("#chart").select("svg").selectAll(".target.highlighted").data().length ? 0.1 : 0.5)
                    .style("stroke-width", "3px");
            }
            if (!this.$d3.select("#parallel").select("#chart").select("svg").selectAll(".target.highlighted").data().length)
                this.dehighlightAllParallel();
        },
        dehighlightAllParallel() {
            this.$d3.select("#parallel").select("#chart").select("svg").selectAll(".target")
                .classed("highlighted", false)
                .transition()
                .duration(500)
                .style("opacity", this.$d3.select("#parallel").select("#chart").select("svg").selectAll(".target.highlighted").data().length ? 0.1 : 0.5)
                .style("stroke-width", (d) => this.parallelIndex === "Individual" ? "1px" : "3px")
                .style("stroke", (d, i) => this.choosePainting(d, i));
        }
    },
    mounted() {
        this.$root.$on('drawParallel', (data) => this.drawParallel(data, this.parallelIndex));
        this.$root.$on('highlightParallel', (subj) => this.highlightParallel(subj));
        this.$root.$on('dehighlightParallel', (subj) => this.dehighlightParallel(subj));
        this.$root.$on('dehighlightAllParallel', () => this.dehighlightAllParallel());
        this.$root.$on('removeScatterUsers', (data) => this.$scatterUsers = data); // hammered for when v-model changes: variable override
    },
    watch: {
        parallelIndex: function() {
            this.drawParallel(this.parallelData, this.parallelIndex);
            setTimeout(() =>
                this.$scatterUsers.forEach(element => {
                    this.highlightParallel(element);
                })
            , 1010);
        }
    },
}
</script>