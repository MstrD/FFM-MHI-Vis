<template>
    <div id="sankey" class="col-12 col-md-7" style="height: 500px">
        <svg></svg>
        <div class="btn-holder">
            <q-btn round color="primary" icon="list">
                <q-tooltip content-class="bg-dark">Socioeconomical Factors</q-tooltip>
                <q-menu transition-show="scale" transition-hide="scale">
                    <Categories
                        :allNodes="allCategories"
                        :currentNodes="defaultNodes"
                        @update-order="updateOrder"
                        @update-current="updateCurrent"
                    />
                </q-menu>
            </q-btn>
        </div>
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
            userLinks: null
        }
    },
    methods: {
        drawSankey(data) {
            var margin = {top: 30, right: 20, bottom: 10, left: 40},
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
                .attr("x", (d) => d.x0 + 5) // this +5 is hammered; it's just to center the text
                .attr("y", (d) => -margin.top/2)
                .attr("dy", "0.35em")
                .style("text-anchor", "middle")
                .style("font-weight", "bold")
                .text((d) => this.defaultNodes.includes(d.category) ? d.category : null);
            node.append("text")
                .attr("x", (d) => d.x0 - 6)
                .attr("y", (d) => (d.y1 + d.y0) / 2)
                .attr("dy", "0.35em")
                .attr("text-anchor", "end")
                .style("text-overflow", "ellipsis")
                .text((d) => this.defaultNodes.includes(d.category) ? d.name : null);
            node.append("title")
                .text((d) => d.name + "\n" + d.value);
        },
        filterSankeyData(data) {
            let tmp = JSON.parse(JSON.stringify(data)); // a temporary variable is used to avoid data loss
            
            if (!this.firstLoad) { // this is only processed on mounting
                this.allCategories = JSON.parse(JSON.stringify(data.categories));
                this.allData = JSON.parse(JSON.stringify(data));
                this.firstLoad = true;
            }
            var filteredLinks = this.filterElements(tmp.links, this.defaultNodes, true);
            tmp.links = filteredLinks;
            this.counter++;
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
                .style("stroke", "orange")
                .style("stroke-opacity", 0.75);
            this.userLinks = linkPaths;
            this.userSelected = subj;
        },
        dehighlightSankey() {
            this.userLinks
                .transition()
                .duration(1000)
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