<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
        <q-toolbar>
          <q-btn
            flat
            round
            dense
            icon="menu"
            class="q-mr-sm"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"/>
          
        <q-toolbar-title>
          <strong>FFM-MHI</strong> Vis
          <q-item-label caption class="text-white" style="font-size: 10pt">An InfoVis Tool on Personality and Mental Health</q-item-label>
        </q-toolbar-title>
        <q-space />
          <div style="display: inline-block">
          <q-btn-dropdown flat round dense persistent icon="filter_list" class="q-mr-xs" id="dropdown">
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
          Database Subjects
        </q-item-label>
        <UserProfile
          v-for="link in elements"
          :key="link.Nº"
          v-bind="link"
        />
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

export default {
  name: 'MainLayout',

  components: {
    UserProfile,
    Filters
  },

  data () {
    return {
      leftDrawerOpen: false,
      elements: this.filters.toApply
    }
  }
}
</script>