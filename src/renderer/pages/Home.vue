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

    <button @click="downloadAllCategories" class="px-3 py-1 text-blue-500 bg-blue-100 rounded">הורד כל הקטוריות</button>
  </div>
</template>

<script>
import { getAllTalkPages } from '../helpers/wiki';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Home',
  data() {
    return {
      pages: [],
    };
  },
  computed: {
    ...mapState('Articles', ['articles', 'categories']),
  },
  methods: {
    ...mapActions('Articles', ['setCategories']),
    getAllPages() {
      this.$wiki.getAllPages((err, pages) => {
        if (err) {
          console.error(err);
          return;
        }
        this.pages = pages;
      });
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
        this.$wiki.log('Pages in category: %d', pages.length);
        this.$wiki.logData(pages);

        let fetchedPages = [];
        pages.forEach(page => {
          this.$wiki.getArticle(page.title, (err, content) => {
            if (err) {
              console.error(err);
              return;
            }
            fetchedPages.push({
              category: cat,
              title: page.title,
              content: content.replace(/\n/g, ' '),
            });
          });
        });
        this.pages = fetchedPages;
      });
    },
    downloadAllCategories() {
      let cat = this.categories[8];
      this.getPagesInCategory(cat);
    },
  },
  mounted() {
    if (!this.categories.length) {
      this.getCategories();
    }
    // this.getAllPages();
  },
};
</script>

<style>
</style>
