<template>
  <div class="flex w-full h-full overflow-auto leading-relaxed text-justify">
    <section
      v-for="(col, i) in columns"
      :key="i"
      class="overflow-y-auto column w-96"
      :style="`z-index: ${100 - i}`"
      style="min-width: 260px"
    >
      <list
        :checkbox="i === 0"
        :list="col"
        :size="i === 0 ? 'large' : 'medium'"
        :ref="`column${i}`"
        @select="selectItem($event, i)"
        @check="$emit('check', $event)"
      />
    </section>
  </div>
</template>

<script>
import List from './List';

export default {
  name: 'IndexView',
  components: { List },
  props: ['categories'],
  data() {
    return {
      columns: [this.categories],
    };
  },
  watch: {
    '$route.query'() {
      // select the category by the index in the route query `?cat=0`
      const queryCatIndex = this.$route.query.cat;
      if (typeof queryCatIndex == 'number') {
        this.$refs.column0[0] && this.$refs.column0[0].select(this.categories[queryCatIndex], queryCatIndex);
      }
    },
  },
  methods: {
    selectItem(item, i) {
      // remove all columns after
      this.columns.length > i && this.columns.splice(i + 1);
      // insert new column
      item.subcats && item.subcats.length && this.columns.push(item.subcats);
    },
  },
};
</script>

<style>
</style>
