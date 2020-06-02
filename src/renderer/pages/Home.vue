<template>
  <div class="py-12">
    <h1>קטגוריות</h1>

    <!-- <ul v-if="pages.length" class="mt-6 divide-y divide-gray-400 rounded bg-gray-80">
      <li v-for="page in pages" :key="page.pageid" class="px-2 py-1 text-sm transition hover:bg-gray-100">
        {{ page }}
      </li>
    </ul>

    <ul v-else-if="categories.length" class="mt-6 divide-y divide-gray-400 rounded bg-gray-80">
      <li
        v-for="cat in categories"
        :key="cat"
        @click="getPagesInCategory(cat)"
        class="px-2 py-1 text-sm transition hover:bg-gray-100"
      >
        {{ cat }}
      </li>
    </ul>

    <loader v-else /> -->
    <div v-if="progress.current" class="my-3">
      <span>
        <span class="text-gray-400">מוריד כרגע:</span>
        <strong>{{ progress.current }}</strong>
      </span>
      <!-- <span class="mr-6">{{ progress.done }}/{{ progress.total }}</span> -->
    </div>

    <button @click="buildCategoryTree" class="px-3 py-1 text-blue-500 bg-blue-100 rounded">הורד כל הקטוריות</button>
    <!--
    <ul class="mt-4">
      <li v-for="cat in catTree" :key="cat.pageid">
        {{ cat.title.replace('קטגוריה:', '') }}
      </li>
    </ul> -->
    <tree-view />
  </div>
</template>

<script>
import { getAllTalkPages, getSubcategories } from '../helpers/wiki';
import { mapState, mapActions } from 'vuex';
import TreeView from '../components/TreeView';

export default {
  name: 'Home',
  components: { TreeView },
  data() {
    return {
      pages: [],
      progress: {
        total: undefined,
        done: undefined,
        current: undefined,
      },
    };
  },
  computed: {
    ...mapState('Articles', ['articles', 'categories']),
  },
  methods: {
    ...mapActions('Articles', ['setCategories', 'store']),

    getAllPages() {
      this.$wiki.getAllPages((err, pages) => {
        if (err) {
          console.error(err);
          return;
        }
        this.pages = pages;
      });
    },
    async buildCategoryTree() {
      const rootCats = await getSubcategories('קטגוריה:עץ קטגוריות ראשי');

      // debugging =====================
      const isDebug = false;
      const limit = 20;
      let level = 0;
      // ===============================

      const getChildren = async cats => {
        level++;
        if (cats.some(cat => cat.type == 'subcat' && !cat.subcats) && (level <= limit || !isDebug)) {
          console.log('diving deeper...', cats);
          cats.forEach(async cat => {
            if (cat.type == 'subcat') {
              this.progress.current = cat.title;
              let subcats = await getSubcategories(cat.title);
              cat.subcats = await getChildren(subcats);
            }
          });
        } else {
          this.progress.current = cats.length ? cats[0].title : '---';
          console.log('coming out...', cats);
        }
        return cats;
      };

      this.catTree = await getChildren(rootCats);
      this.progress.current = undefined;
      // console.log(this.catTree);
    },
    getCategories() {
      this.$wiki.getCategories((err, cats) => {
        if (err) {
          console.error(err);
          return;
        }
        this.setCategories(cats);
      });
    },
    getAllTalkPages() {
      getAllTalkPages((err, pages) => {
        if (err) {
          console.error(err);
          return;
        }
        this.pages = pages;
      });
    },
    getPagesInCategory(cat) {
      this.$wiki.getPagesInCategory(cat, (err, pages) => {
        console.log('Pages in category: %d', pages.length);
        console.log({ pages });

        let fetchedPages = [];
        pages.forEach(page => {
          this.$wiki.getArticle(page.title, (err, content) => {
            if (err) {
              console.error(err);
              return;
            }

            console.log({ content });
            this.store({
              category: cat,
              title: page.title,
              content: content.replace(/\n/g, ' '),
            });
          });
        });
      });
    },
    downloadAllCategories() {
      let cats = this.categories.slice(1, 5);
      this.progress.total = cats.length;
      this.progress.done = 0;

      // TODO: convert callback hell to async/await [likely need to fork the `nodemw` repo for that]
      cats.forEach((cat, i) => {
        this.progress.current = cat;
        this.getPagesInCategory(cat);
        this.progress.done = i + 1;
      });
    },
  },
  async mounted() {
    if (!this.categories.length) {
      this.getCategories();
    }
  },
};
</script>

<style>
</style>
