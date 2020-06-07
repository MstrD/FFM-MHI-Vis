<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    this.$q.loading.show({
        message: 'Loading interface, please wait...'
      })
    // hiding in 3s
    this.timer = setTimeout(() => {
      this.$q.loading.hide()
      this.timer = void 0
    }, 2000)
  },
  beforeDestroy () {
    if (this.timer !== void 0) {
      clearTimeout(this.timer)
      this.$q.loading.hide()
    }
  }
}
</script>

<style lang="scss">
  #q-app, .q-page, .q-list {
    outline: none !important;
    -webkit-touch-callout: none !important; /* iOS Safari */
    -webkit-user-select: none !important; /* Safari */
     -khtml-user-select: none !important; /* Konqueror HTML */
       -moz-user-select: none !important; /* Old versions of Firefox */
        -ms-user-select: none !important; /* Internet Explorer/Edge */
            user-select: none !important; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  }
</style>
