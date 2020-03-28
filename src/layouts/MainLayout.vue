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
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
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
import EssentialLink from 'components/EssentialLink'
import Filters from 'components/Filters';

export default {
  name: 'MainLayout',

  components: {
    EssentialLink,
    Filters
  },

  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: 'Docs',
          caption: 'quasar.dev',
          icon: 'school',
          link: 'https://quasar.dev'
        },
        {
          title: 'Github',
          caption: 'github.com/quasarframework',
          icon: 'code',
          link: 'https://github.com/quasarframework'
        },
        {
          title: 'Discord Chat Channel',
          caption: 'chat.quasar.dev',
          icon: 'chat',
          link: 'https://chat.quasar.dev'
        },
        {
          title: 'Forum',
          caption: 'forum.quasar.dev',
          icon: 'record_voice_over',
          link: 'https://forum.quasar.dev'
        },
        {
          title: 'Twitter',
          caption: '@quasarframework',
          icon: 'rss_feed',
          link: 'https://twitter.quasar.dev'
        },
        {
          title: 'Facebook',
          caption: '@QuasarFramework',
          icon: 'public',
          link: 'https://facebook.quasar.dev'
        }
      ]
    }
  }
}
</script>