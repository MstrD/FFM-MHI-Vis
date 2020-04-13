<template>
    <div id="sankey" class="col-12 col-md-5" style="height: 400px">
    </div>
</template>

<script>
import PageIndex from 'pages/Index';
import * as d3sankey from 'd3-sankey';
export default {
    name: 'Sankey',
    components: {
        PageIndex
    },
    data() {
        return {
            allNodes: [],
            currentNodes: []
        }
    },
    methods: {
        drawSankey(data) {
            console.log(data);
            var margin = {top: 20, right: 20, bottom: 30, left: 40},
                width = 700 - margin.left - margin.right,
                height = 450 - margin.top - margin.bottom;

            this.$d3.select("#sankey").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var svg = this.$d3.select("#sankey").select("svg").select("g");
            var color = this.$d3.scaleOrdinal(this.$d3.schemeCategory10);

            var sankey = d3sankey.sankey()
                .nodeId(d => d.name)
                .nodeWidth(15)
                .nodePadding(10)
                .extent([[1, 1], [width - 1, height - 6]]);

            var link = svg.append("g")
                .attr("class", "links")
                .attr("fill", "none")
                .attr("stroke", "#000")
                .attr("stroke-opacity", 0.2)
            .selectAll("path");

            var node = svg.append("g")
                .attr("class", "nodes")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
            .selectAll("g");

            var graph = sankey(data);
            link = link
                .data(data.links)
                .enter().append("path")
                .attr("d", d3sankey.sankeyLinkHorizontal())
                .attr("stroke-width", (d) => Math.max(1, d.width));
            link.append("title")
                .text((d) => d.source.name + " → " + d.target.name + "\n" + d.value);
                
            node = node
                .data(data.nodes)
                .enter().append("g");
            node.append("rect")
                .attr("x", (d) => d.x0)
                .attr("y", (d) => d.y0)
                .attr("height", (d) => d.y1 - d.y0)
                .attr("width", (d) => d.x1 - d.x0)
                .attr("fill", (d) => color(d.name))
                .attr("stroke", "#000");
            node.append("text")
                .attr("x", (d) => d.x0 - 6)
                .attr("y", (d) => (d.y1 + d.y0) / 2)
                .attr("dy", "0.35em")
                .attr("text-anchor", "end")
                .style("overflow", "ellipsis")
                .text((d) => d.name);
            node.append("title")
                .text((d) => d.name + "\n" + d.value);
        }
    },
    mounted() {
        this.$root.$on('drawSankey', (data) => this.drawSankey(data));
    }
}
</script>