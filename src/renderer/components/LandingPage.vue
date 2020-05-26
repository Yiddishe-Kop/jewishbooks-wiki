<template>
  <div>
    <h1 class="font-semibold">עמודים שמורים</h1>
    <ul>
      <transition-group name="list" class="grid grid-cols-2 gap-4 mt-6 md:grid-cols-3 lg:grid-cols-4" appear>
        <article-card
          v-for="article in articles"
          :key="article.dataValues.id"
          :article="article.dataValues"
          @delete="deleteArticle(article.dataValues)"
        />
      </transition-group>
    </ul>

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
              @click="saveArticleOffline(result)"
              class="relative z-20 p-2 mt-3 text-sm font-semibold text-green-500 transition bg-green-100 rounded-md focus:outline-none hover:bg-green-200"
            >
              <icon name="download" class="w-6" />
            </button>
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
import { Article } from '../../db';
import { mapState, mapActions } from 'vuex';
import ArticleCard from '../components/ArticleCard';

export default {
  name: 'landing-page',
  components: { ArticleCard },
  data() {
    return {
      query: 'סוכה',
      isLoading: false,
      searchResults: [],
      error: '',
    };
  },
  computed: {
    ...mapState('Articles', ['articles']),
    ...mapState('Bot', ['Wiki']),
  },
  methods: {
    ...mapActions('Articles', ['refreshArticles']),
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    searchWiki() {
      this.error = '';
      this.isLoading = true;
      this.Wiki.search(this.query, (err, data) => {
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
    async saveArticleOffline(article) {
      this.Wiki.getArticle(article.title, async (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        const newArticle = await Article.create({
          title: article.title,
          body: data,
        });
        this.$store.state.Articles.articles.push(newArticle);
      });
    },
    // async refreshArticles() {
    //   const allArticles = await Article.findAll();
    //   console.log({ allArticles });
    //   // this.$store.commit("Articles/SET_ARTICLES", allArticles);
    //   this.$store.state.Articles.articles = allArticles;
    // },
    async deleteArticle(article) {
      await Article.destroy({
        where: {
          id: article.id,
        },
      });
      this.refreshArticles();
    },
  },
  async mounted() {
    this.refreshArticles();
  },
};
</script>
