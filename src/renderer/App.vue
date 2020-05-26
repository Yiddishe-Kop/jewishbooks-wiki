<template>
  <div id="app">
    <layout>
      <router-view></router-view>
    </layout>
  </div>
</template>

<script>
import Layout from './layouts/default'
  export default {
    name: 'jewishbooks-wiki',
    components: { Layout }
  }
</script>

<style>
  /* CSS */
</style>
