<template>
  <div>
    <h1 class="font-semibold">עמודים שמורים</h1>
    <ul v-if="articles.length">
      <transition-group name="list" class="grid grid-cols-2 gap-4 mt-6 md:grid-cols-3 lg:grid-cols-4" appear>
        <article-card
          v-for="article in articles"
          :key="article.title"
          :article="article"
          @delete="destroy(article.title)"
        />
      </transition-group>
    </ul>
    <div v-else class="py-16 text-center rounded-lg bg-gray-80">
      <p>עמודים שהורדת יוצגו כאן</p>
    </div>

    <section class="mt-12">
      <h1 class="font-semibold">חיפוש עמודים</h1>
      <div class="flex items-center mt-2 mb-6 space-x-2">
        <input
          @keyup.enter="searchWiki()"
          v-model="query"
          class="w-full form-input"
          placeholder="חפש כל מה שעולה על דעתך..."
        />
      </div>
      <ul v-if="searchResults.length && !isLoading">
        <transition-group name="list" class="grid grid-cols-2 gap-4 mt-6 md:grid-cols-3 lg:grid-cols-4" appear>
          <li
            v-for="result in searchResults"
            :key="result.pageid"
            class="relative p-4 transition bg-gray-200 rounded-lg hover:bg-blue-50"
          >
            <h2>{{ result.title }}</h2>
            <button
              v-if="notYetSaved(result)"
              @click="saveArticleOffline(result)"
              class="relative z-20 p-2 mt-3 text-sm font-semibold text-blue-500 transition bg-blue-100 rounded-md focus:outline-none hover:bg-blue-200"
            >
              <icon name="download" class="w-6" />
            </button>
            <icon v-else name="check-circle" class="w-8 p-1 mt-3 text-green-500 rounded-full bg-green-50" />
          </li>
        </transition-group>
      </ul>
      <div v-else class="px-12 py-20 text-center border-4 border-gray-200 rounded-lg">
        <p v-if="!isLoading" class="text-gray-400">חפש משהו!</p>
        <loader v-else-if="isLoading && !error" />
        <p v-else-if="!!error" class="text-gray-400">{{ error }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ArticleCard from '../components/ArticleCard';

export default {
  name: 'landing-page',
  components: { ArticleCard },
  data() {
    return {
      query: 'מסכת שבת',
      isLoading: false,
      searchResults: [],
      error: '',
    };
  },
  computed: {
    ...mapState('Articles', ['articles']),
  },
  methods: {
    ...mapActions('Articles', ['refreshArticles', 'store', 'destroy']),
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    searchWiki() {
      this.error = '';
      this.isLoading = true;
      this.$wiki.search(this.query, (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        if (!data.length) {
          this.error = 'לא נמצאו תוצאות לחיפוש שלכם.';
          return;
        }

        this.searchResults = data;
        this.isLoading = false;
      });
    },
    notYetSaved(article) {
      return !this.articles.some(a => a.title == article.title);
    },
    async saveArticleOffline(article) {
      this.$wiki.getArticle(article.title, async (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        this.store({
          title: article.title,
          body: data,
        });
      });
    },
  },
  async mounted() {
    this.searchWiki();
  },
};
</script>
