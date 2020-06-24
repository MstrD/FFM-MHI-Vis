<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
        <q-toolbar class="glossy">
          <q-btn
            flat
            round
            dense
            icon="menu"
            class="q-mr-sm"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen">
            <q-tooltip content-class="bg-dark">Individuals</q-tooltip>
          </q-btn>
          
        <q-toolbar-title>
          <strong>FFM-MHI</strong> Vis
          <q-item-label caption class="text-white" style="font-size: 10pt">An InfoVis Tool on Personality and Mental Health</q-item-label>
        </q-toolbar-title>
        <q-space />
          <div class="btn-holder" style="display: inline-block">
            <q-btn-dropdown flat round dense label="Sociodemographics" icon="group">
              <Categories
                  :allNodes="allCategories"
                  :currentNodes="defaultNodes"
                  @update-order="updateOrder"
                  @update-current="updateCurrent"
              />
            </q-btn-dropdown>
            <q-tooltip content-class="bg-dark">Sociodemographic Factors</q-tooltip>
          </div>
          <div style="display: inline-block">
          <q-btn-dropdown flat round dense label="Filters" icon="filter_list" class="q-mr-xs" id="dropdown">
            <Filters />
          </q-btn-dropdown>
          <q-tooltip content-class="bg-dark">Filters</q-tooltip>
          </div>
          <q-btn flat round dense icon="settings" @click="settings_dialog = true">
            <q-dialog v-model="settings_dialog">
              <q-card>
                  <q-card-section>
                  <div class="text-h6">Settings</div>
                  </q-card-section>

                  <q-separator />

                  <q-card-section style="max-height: 50vh" class="scroll">
                    <q-item-label header class="settings_header">Male Color</q-item-label>
                    <q-input
                      filled
                      v-model="maleColor"
                      :rules="['anyColor']"
                      class="color-input color-input-male"
                    >
                      <template v-slot:append>
                        <q-icon name="colorize" class="cursor-pointer">
                          <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-color v-model="maleColor" no-footer />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <q-item-label header class="settings_header">Female Color</q-item-label>
                    <q-input
                      filled
                      v-model="femaleColor"
                      :rules="['anyColor']"
                      class="color-input color-input-female"
                    >
                      <template v-slot:append>
                        <q-icon name="colorize" class="cursor-pointer">
                          <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-color v-model="femaleColor" no-footer />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <!-- <q-toggle
                      v-model="showHeatmap"
                      label="Show Heatmap Results"
                    /> -->
                  </q-card-section>

                  <q-separator />

                  <q-card-actions align="right">
                  <q-btn flat label="Cancel" color="negative" v-close-popup />
                  <q-btn flat label="Restore to Default" color="positive" v-close-popup @click="defaultSettings()"/>
                  <q-btn flat label="Apply" color="primary" v-close-popup @click="saveSettings()"/>
                  </q-card-actions>
              </q-card>
            </q-dialog>
            <q-tooltip content-class="bg-dark">Settings</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="help_outline" @click="help_dialog = true">
            <q-dialog v-model="help_dialog">
              <q-card>
                  <q-card-section>
                  <div class="text-h6">Help</div>
                  </q-card-section>

                  <q-separator />

                  <q-card-section style="max-height: 50vh" class="scroll">
                  <p v-for="n in 15" :key="n">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.</p>
                  </q-card-section>

                  <q-separator />

                  <q-card-actions align="right">
                  <q-btn flat label="Decline" color="primary" v-close-popup />
                  <q-btn flat label="Accept" color="primary" v-close-popup />
                  </q-card-actions>
              </q-card>
            </q-dialog>
            <q-tooltip content-class="bg-dark">Help</q-tooltip>
          </q-btn>
          <!--q-btn
            flat
            round
            dense
            icon="menu"
            class="q-mr-sm"
            aria-label="Menu"
            @click="rightDrawerOpen = !rightDrawerOpen">
            <q-tooltip content-class="bg-dark">Heatmaps</q-tooltip>
          </q-btn>-->
        </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Database Individuals
        </q-item-label>
        <q-input class="q-mb-md q-pl-md q-pr-md"
          clearable
          dense
          clear-icon="close"
          filled
          type="number"
          color="primary"
          v-model="model"
          hint="Filter by ID..."
          :rules="[val => val >= 0 && val <= 199 || 'Please insert an ID between 0 and 199']"
          @input="selectUser()"
        >
          <template v-slot:append>
            <q-icon v-if="!model" name="search" />
          </template>
        </q-input>
        <div class="q-pl-md q-mb-xs" style="font-size: 9pt">
          <q-icon name="lens" color="female" /> Female
          <q-icon name="lens" color="male" class="q-pl-md q-pr-sm" /> Male
          <span style="float: right" class="q-mr-lg text-grey-6"><i>{{ elements.length }} subjects found</i></span>
        </div>
        <UserProfile 
          v-for="link in elements"
          :key="link.Nº"
          v-bind="link"/>
      </q-list>
    </q-drawer>

    <q-drawer
      v-if="showHeatmap"
      v-model="rightDrawerOpen"
      side="right"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list class="rightDrawer">
        <q-item-label
          header
          class="text-grey-8"
        >
          Heatmaps
        </q-item-label>
        <q-separator />
        <svg
          class="heatmap_legend"
          width="300"
          height="50"
        >
        </svg>
        <q-separator />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import UserProfile from 'components/UserProfile';
import Filters from 'components/Filters';
import Categories from 'components/Categories';

export default {
  name: 'MainLayout',

  components: {
    UserProfile,
    Filters,
    Categories
  },

  
  data () {
    return {
      leftDrawerOpen: true,
      rightDrawerOpen: false,
      elements: this.$filters.toApply,

      model: '',
      settings_dialog: false,
      help_dialog: false,

      maleColor: this.$getColor("male"),
      femaleColor: this.$getColor("female"),
      showHeatmap: true,

      allCategories: null,
      defaultNodes: [
          'Gender',
          'Residence',
          'Work Status',
          'Religion'
      ]
    }
  },
  methods: {
    selectUser() {
      if (!this.model)
        this.resetElements();
      else if (this.model >= 0 && this.model <= 199)
        this.elements = [this.$els.find((d) => d.Nº === parseInt(this.model))]
      else
        return;
    },
    resetElements() {
      this.elements = this.$filters.toApply;
    },
    updateOrder(nodes) {
      this.$root.$emit('updateOrder', nodes);
    },
    updateCurrent(current) {
      this.$root.$emit('updateCurrent', current);
    },
    drawHeatmapLegend() {
      var labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
      var width = 300, height = 50;
      const colorScale = this.$d3.scaleLinear()
        .domain([0, 4])
        .range([this.$getColor("info"), this.$getColor("primary")]);
      var svg = this.$d3.select(".rightDrawer").select("svg.heatmap_legend")

      // draw legend
      const legend = svg.selectAll(".legend")
          .data(labels)
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", (d, i) => `translate(${i * 40}, 10)`);

      // draw legend colored rectangles
      legend
          .append("rect")
          .attr("x", 50)
          .attr("width", 40)
          .attr("height", 18)
          .style("fill", (_, i) => colorScale(i));

      // draw legend text
      legend.append("text")
          .attr("x", 70)
          .attr("y", 30)
          .attr("dy", ".35em")
          .style("text-anchor", "middle")
          .style("font-size", "8pt")
          .text((d, i) => i === 0 || i === (labels.length - 1) ? d : null);
    },
    async saveSettings() {
      if (this.$getColor("male") !== this.maleColor)
        await this.$axios.post('/maleColor', {
          maleColor: this.maleColor
        });
      if (this.$getColor("female") !== this.femaleColor)
        await this.$axios.post('/femaleColor', {
          femaleColor: this.femaleColor
        });
      this.$router.go();
    },
    async defaultSettings() {
      await this.$axios.get('/default');
      this.$router.go();
    }
  },
  mounted() {
    this.$root.$on('updateFilter', (filter) => this.elements = filter);
    this.$root.$on('allCategories', (cats) => this.allCategories = cats);
    this.$root.$on('openRightDrawer', () => this.rightDrawerOpen = true);
    this.$root.$on('closeRightDrawer', () => this.rightDrawerOpen = false);
    this.drawHeatmapLegend();
  }
}
</script>

<style lang="scss">
  input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type="number"] {
      -moz-appearance: textfield;
  }

  .color-input .q-field__inner {
    border-radius: 10px;
  }

  .settings_header {
    padding-top: 5px;
    padding-bottom: 5px;
  }
</style>