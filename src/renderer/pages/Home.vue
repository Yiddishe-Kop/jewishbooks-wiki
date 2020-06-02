<template>
  <div>
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
          הורד קטגוריות
        </h2>
        <p class="text-gray-600">סמן קטגוריות שברצונך להוריד למחשב שלך</p>
      </div>
      <div class="flex mt-4 md:mt-0 md:ml-4">
        <span class="mr-3 rounded-md shadow-sm">
          <button
            @click="downloadCategoryPages"
            class="inline-flex items-center px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700"
          >
            <icon name="download" class="w-5 ml-2" />
            הורד
          </button>
        </span>
      </div>
    </div>

    <tree-view class="mt-6" ref="treeView" />
  </div>
</template>

<script>
import { getAllTalkPages, getSubcategories, getPagesInCategory, getArticle } from '../helpers/wiki';
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
    async getPagesInCategory(cat) {
      const pages = await getPagesInCategory(cat);
      console.log('Pages in category: %d', pages.length);
      console.log({ pages });

      let fetchedPages = [];
      pages.forEach(async page => {
        const content = await getArticle(page.title);
        console.log({ content });
        this.store({
          category: cat,
          title: page.title,
          content: content,
        });
      });
    },
    async downloadCategoryPages() {
      let pageIds = this.$refs.treeView.categories
        .filter(cat => cat.selected)
        .reduce(flat, [])
        .filter(c => c.type == 'page')
        .map(c => c.pageid);

      pageIds = [...new Set(pageIds)]; // remove duplicates

      console.log(`Downloading ${pageIds.length} pages...`);

      pageIds.forEach(async (pageId, i) => {
        const pageContent = await getArticle(pageId);
        console.log(`Downloaded page ${i + 1}...`);
        this.store({
          id: pageId,
          content: pageContent,
        });
      });

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
  async mounted() {},
};
</script>

<style>
</style>
