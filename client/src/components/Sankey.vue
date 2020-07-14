<template>
    <div id="sankey" class="q-mt-xl q-pl-xl col-12 col-md-7" style="height: 600px">
        <svg></svg>
    </div>
</template>

<script>
import PageIndex from 'pages/Index';
import Categories from 'components/Categories';
import * as d3sankey from 'd3-sankey';
export default {
    name: 'Sankey',
    components: {
        PageIndex,
        Categories
    },
    data() {
        return {
            allCategories: null,
            defaultNodes: [
                'Gender',
                'Residence',
                'Work Status',
                'Religion'
            ],
            firstLoad: false,
            allData: null,
            counter: 0,
            userSelected: null,
            userLinks: null,
            xPositions: [],
        }
    },
    methods: {
        drawSankey(data) {
            var margin = {top: 30, right: 25, bottom: 10, left: 80},
                width = this.$d3.select("#sankey").property("clientWidth") - margin.left - margin.right,
                height = this.$d3.select("#sankey").property("clientHeight") - margin.top - margin.bottom;

            this.$d3.select("#sankey").select("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var svg = this.$d3.select("#sankey").select("svg").select("g");
            var color = this.$d3.scaleOrdinal(this.$d3.schemeCategory20);

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
            var self = this;
            link = link
                .data(data.links)
                .enter().append("path")
                .attr("d", d3sankey.sankeyLinkHorizontal())
                .attr("stroke-width", (d) => Math.max(1, d.width));
            link.append("title")
                .text((d) => d.source.name + " → " + d.target.name + "\n" + d.value);
                
            node = node
                .data(data.nodes)
                .enter().append("g")
                .call(this.$d3.drag()
                    .subject(d => d)
                    .on('start', function () { this.parentNode.appendChild(this); })
                    .on('drag', function(d) {
                        var rectY = self.$d3.select(this).select("rect").attr("y");
                        d.y0 = d.y0 + self.$d3.event.dy;
                        var yTranslate = d.y0 - rectY;
                        self.$d3.select(this).attr("transform", 
                                    "translate(0" + "," + (yTranslate) + ")");
                        sankey.update(graph);
                        link.attr("d", d3sankey.sankeyLinkHorizontal());
                    })
                );
            node.append("rect")
                .attr("x", (d) => {
                    if (!this.xPositions.includes(d.x0 + 5) && this.defaultNodes.includes(d.category))
                        this.xPositions.push(d.x0 + 5);
                    this.xPositions = this.xPositions.sort(this.$d3.ascending);
                    return d.x0;
                })
                .attr("y", (d) => d.y0)
                .attr("height", (d) => d.y1 - d.y0)
                .attr("width", (d) => d.x1 - d.x0)
                .attr("fill", (d) => color(d.name))
                .attr("stroke", "#000")
                .style("cursor", "move");
            node.append("text")
                .attr("x", (d) => d.x0 - 6)
                .attr("y", (d) => (d.y1 + d.y0) / 2)
                .attr("dy", "0.35em")
                .attr("text-anchor", "end")
                .style("text-overflow", "ellipsis")
                .style("white-space", "pre-line")
                .text((d) => this.defaultNodes.includes(d.category) ? d.name : null)
                .call(wrap, 80);
            node.append("title")
                .text((d) => {
                    let myRes = `${d.name}: ${d.value}`;
                    if (this.defaultNodes.indexOf(d.category) !== this.defaultNodes.length - 1) {
                        let nextCat = this.defaultNodes[this.defaultNodes.indexOf(d.category) + 1];
                        let list = data.links.filter((el) => el.source.name === d.name && el.targetCat === nextCat);
                        myRes += '\n\n   from which:\n';
                        for (let el of list)
                            myRes += `   • ${el.target.name}: ${el.value}\n`;
                    }
                    return myRes;
                });
            
            // add category labels
            svg.selectAll(".label")
                .data(this.defaultNodes)
                .enter()
                .append("text")
                .attr("class", "label")
                .attr("x", (d, i) => this.xPositions[i]) // this +5 is hammered; it's just to center the text
                .attr("y", (d) => -margin.top/2)
                .attr("dy", "0.35em")
                .style("text-anchor", "middle")
                .style("font-weight", "bold")
                .style("font-size", "9pt")
                .text((d) => d ? d : null);

            var self = this;

            // function that implements labels' text wrapping;
            // imported from https://stackoverflow.com/a/35405267
            function wrap(text, width) {
                text.each(function() {
                    var text = self.$d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    y = text.attr("y"),
                    x = text.attr("x"),
                    dy = parseFloat(text.attr("dy")),
                    lineHeight = 1.1, // ems
                    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");     
                    while (word = words.pop()) {
                        line.push(word);
                        tspan.text(line.join(" "));
                        var textWidth = tspan.node().getComputedTextLength();
                        if (tspan.node().getComputedTextLength() > width) {
                            line.pop();
                            tspan.text(line.join(" "));
                            line = [word];
                            ++lineNumber;
                            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", lineNumber * lineHeight + dy + "em").text(word);
                        }
                    }
                });
            }
        },
        filterSankeyData(data) {
            let tmp = JSON.parse(JSON.stringify(data)); // a temporary variable is used to avoid data loss
            
            if (!this.firstLoad) { // this is only processed on mounting
                this.allCategories = JSON.parse(JSON.stringify(data.categories));
                this.$root.$emit('allCategories', this.allCategories);

                this.allData = JSON.parse(JSON.stringify(data));
                this.firstLoad = true;
            }
            var filteredLinks = this.filterElements(tmp.links, this.defaultNodes, true);
            tmp.links = filteredLinks;
            this.counter++;
            this.xPositions = [];
            this.drawSankey(tmp);
        },
        filterElements(links, myNodes, isMain) {
            var result = [];
            for (let i = 0; i < myNodes.length - 1; i++) {
                links.forEach(element => {
                    if (isMain) {
                        if (element.sourceCat === myNodes[i] && element.targetCat === myNodes[i+1])
                            result.push(element);
                    }
                    else {
                        if (element.source === myNodes[i] && element.target === myNodes[i+1])
                            result.push(element);
                    }
                });
            }
            return result;
        },
        updateOrder(nodes) {
            this.allCategories = nodes;
        },
        updateCurrent(current) {
            this.defaultNodes = current;
        },
        highlightSankey(subj) {
            this.dehighlightSankey();

            let results = [];
            this.defaultNodes.forEach(element => {
                // this shady piece of code invokes a function from user-info.js based on its name
                let funcName = `$get${element.replace(/\s+/g, '')}`;
                const res = this[funcName](subj);
                // the string results are stored to be further processed
                results.push(res);
            });
            let tmp = this.filterElements(this.allData.links, results, false);
            // filter the paths that belong to 'subj'
            let linkPaths = this.$d3.select("#sankey").select("svg").select("g").selectAll("path");
            linkPaths = linkPaths.filter((d) => {
                return tmp.some((f) => {
                    return f.source === d.source.name && f.target === d.target.name;
                });
            });
            // these paths will be painted with another color
            linkPaths
                .transition()
                .duration(1000)
                .style("stroke", this.$getColor("dark"))
                .style("stroke-opacity", 0.75);
            this.userLinks = linkPaths;
            this.userSelected = subj;
        },
        dehighlightSankey() {
            this.$d3.select("#sankey").select("svg").select("g").selectAll("path")
                .style("stroke", "#000")
                .style("stroke-opacity", 0.2);
            this.userSelected = null;
            this.userLinks = null;
        }
    },
    watch: {
        defaultNodes: function() {
            this.$d3.select("#sankey").select("svg").select("g").remove();
            this.filterSankeyData(this.allData);
            if (this.userSelected) {
                this.highlightSankey(this.userSelected);
            }
        }
    },
    mounted() {
        this.$root.$on('drawSankey', (data) => this.filterSankeyData(data));
        this.$root.$on('highlightSankey', (subj) => this.highlightSankey(subj));
        this.$root.$on('dehighlightSankey', () => this.dehighlightSankey());

        this.$root.$on('updateOrder', (nodes) => this.updateOrder(nodes));
        this.$root.$on('updateCurrent', (current) => this.updateCurrent(current));
    }
}
</script>

<style lang="scss" scoped>
    #sankey {
        justify-content: space-between;
        flex-direction: column;
        height: 100vh;
        display: flex;
    }
    #sankey .btn-holder {
        justify-content: flex-end;
        display: flex;
        //margin-right: -40px;
    }
</style>