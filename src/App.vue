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
