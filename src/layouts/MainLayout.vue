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
          <q-btn-dropdown flat round dense persistent label="Filters" icon="filter_list" class="q-mr-xs" id="dropdown">
            <Filters />
          </q-btn-dropdown>
          <q-tooltip content-class="bg-dark">Filters</q-tooltip>
          </div>
          <q-btn flat round dense icon="settings" class="q-mr-xs">
            <q-tooltip content-class="bg-dark">Settings</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="help_outline">
            <q-tooltip content-class="bg-dark">Help</q-tooltip>
          </q-btn>
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
          <q-icon name="lens" color="primary" /> Female
          <q-icon name="lens" color="orange" class="q-pl-md q-pr-sm" /> Male
          <span style="float: right" class="q-mr-lg text-grey-6"><i>{{ elements.length }} subjects found</i></span>
        </div>
        <UserProfile 
          v-for="link in elements"
          :key="link.Nº"
          v-bind="link"/>
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
      leftDrawerOpen: false,
      elements: this.$filters.toApply,

      model: '',

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
  },
  mounted() {
    this.$root.$on('updateFilter', (filter) => this.elements = filter);
    this.$root.$on('allCategories', (cats) => this.allCategories = cats);
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
</style>