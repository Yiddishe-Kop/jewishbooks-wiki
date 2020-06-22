<template>
  <div>
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
          <icon name="home" class="inline-block w-6" />
          עץ קטגוריות ראשי
        </h2>
        <p class="text-gray-600">{{ online ? 'סמן קטגוריות שברצונך להוריד למחשב שלך' : 'תפריט של כל הקטגוריות' }}</p>
      </div>
      <div class="flex mt-4 mr-4">
        <span class="mr-3 rounded-md shadow-sm">
          <button
            @click="downloadSelectedCategoryPages"
            :class="[
              online && hasSelectedCategories
                ? 'bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700'
                : 'bg-indigo-100',
            ]"
            class="inline-flex items-center px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md"
          >
            <icon name="download" class="w-5 ml-2" />
            הורד
          </button>
        </span>
      </div>
    </div>

    <task-progress
      v-if="progress.active"
      label="מוריד"
      :currentTitle="progress.currentTitle"
      :total="progress.total"
      :done="progress.done"
      class="mt-4"
    />

    <tree-view
      :categories="categories"
      @download-category="downloadCategory"
      @check="checkCategory"
      :busy="progress.active"
      class="mt-6"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import TaskProgress from '../components/ui/TaskProgress';
import TreeView from '../components/TreeView';

export default {
  name: 'Home',
  components: { TreeView, TaskProgress },
  data() {
    return {
      categories: this.$jewishBooks.categoryTree,
      progress: {
        active: false,
        currentTitle: '',
        total: 0,
        done: 0,
      },
    };
  },
  computed: {
    ...mapState('Articles', ['articles']),
    ...mapState('App', ['online']),
    hasSelectedCategories() {
      return this.categories.filter(cat => cat.selected).length;
    },
  },

  methods: {
    ...mapActions('Articles', ['store']),
    downloadCategory(category) {
      this.downloadCategoryPages([category]);
    },
    downloadSelectedCategoryPages() {
      const categories = this.categories.filter(cat => cat.selected);
      this.downloadCategoryPages(categories);
    },
    async downloadCategoryPages(categories) {
      let pageIds = categories
        .reduce(flat, [])
        .filter(c => c.type == 'page')
        .map(c => c.pageid); // maybe add the title? 🤔

      pageIds = [...new Set(pageIds)]; // remove duplicates

      console.log(`Downloading ${pageIds.length} pages...`);
      this.progress = {
        active: true,
        currentTitle: 'מתחיל...',
        total: pageIds.length,
        done: 0,
      };

      for (const pageId of pageIds) {
        this.progress.currentTitle = this.$jewishBooks.pages.find(p => p.pageid == pageId).title;
        this.progress.done++;
        const pageContent = await this.$wiki.getArticle(pageId);
        this.store({
          id: pageId,
          content: pageContent,
        });
      }
      this.progress.active = false;

      function flat(r, a) {
        var b = {};
        Object.keys(a).forEach(k => {
          if (k !== 'subcats') {
            b[k] = a[k];
          }
        });
        r.push(b);
        if (Array.isArray(a.subcats)) {
          return a.subcats.reduce(flat, r);
        }
        return r;
      }
    },
    checkCategory(e) {
      this.$set(this.categories[e.i], 'selected', e.value);
    },
  },
  async mounted() {},
};
</script>

<style>
</style>
