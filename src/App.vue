<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  mounted () {
    this.getIndexBanner()
  },
  methods: {
    ...mapActions(['getIndexBanner'])
  }
}
</script>

<style lang="less">
#app{
  height: 100%;
}
</style>
