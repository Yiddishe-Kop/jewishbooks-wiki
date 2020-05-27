<template>
  <div id="app">
    <router-view v-if="$route.meta.layout == 'minimal'"></router-view>
    <layout v-else>
      <router-view></router-view>
    </layout>
  </div>
</template>

<script>
import Layout from './layouts/default';
export default {
  name: 'jewishbooks-wiki',
  components: { Layout },
};
</script>

<style>
/* CSS */
</style>
