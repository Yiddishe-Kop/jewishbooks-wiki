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
        @select="selectItem($event, i)"
        @check="checkCategory"
      />
    </section>
  </div>
</template>

<script>
import catTree from '../assets/categoryTree.json';
import List from './List';

export default {
  name: 'IndexView',
  components: { List },
  data() {
    return {
      columns: [catTree],
      categories: catTree,
    };
  },
  methods: {
    selectItem(item, i) {
      // remove all columns after
      this.columns.length > i && this.columns.splice(i + 1);
      // insert new column
      item.type == 'subcat' && this.columns.push(item.subcats);
    },
    checkCategory(e) {
      this.categories[e.i].selected = e.value;
    },
  },
};
</script>

<style>
</style>
