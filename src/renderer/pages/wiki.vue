<template>
  <div class="py-8">
    <p class="text-gray-600">כאן אפשר לערוך דף ויקי גם אופליין</p>

    <div class="flex items-center justify-between space-x-2">
      <div>
        <h1 class="text-3xl font-black text-gray-800">{{ article.title }}</h1>
      </div>
      <div class="flex">
        <button
          @click="saveChangesLocal"
          class="flex items-center p-2 ml-2 text-green-500 transition bg-green-100 rounded-md hover:bg-green-200"
        >
          <icon name="save" class="inline-block w-5 ml-2" />
          <span>שמור שינויים</span>
        </button>
        <button
          @click="syncWikiArticle"
          class="flex items-center p-2 text-blue-500 transition bg-blue-100 rounded-md hover:bg-blue-200"
        >
          <icon name="refresh" class="inline-block w-5 ml-2" />
          <span>סנכרן שינויים</span>
        </button>
      </div>
    </div>

    <section class="mt-12 wiki">
      <div v-if="!!wikitext" class="grid grid-cols-2 gap-8">
        <div class="relative p-1 border border-green-700 rounded">
          <span
            class="absolute top-0 right-0 px-3 mr-2 text-sm font-semibold leading-5 text-green-100 transform -translate-y-1/2 bg-green-700 rounded-full"
            >עריכה</span
          >
          <textarea v-model="wikitext" class="w-full h-full p-4"></textarea>
        </div>
        <div class="relative border border-blue-700 rounded">
          <span
            class="absolute top-0 right-0 px-3 mr-2 text-sm font-semibold leading-5 text-blue-100 transform -translate-y-1/2 bg-blue-700 rounded-full"
            >תצוגה מקדימה</span
          >
          <vue-wikitext :source="wikitext" class="p-4" />
        </div>
      </div>
      <div v-else-if="!!error" v-html="error" class="my-16 text-sm text-center text-red-500"></div>
      <div v-else class="my-16 text-center text-gray-400">התוצאות יוצגו כאן</div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'wikipedia',
  data() {
    return {
      query: 'מסכת שבת',
      article: {},
      wikitext: '',
      error: '',
    };
  },
  computed: {
    ...mapState('Articles', ['articles']),
  },
  methods: {
    ...mapActions('Articles', ['update']),
    showArticle() {
      const articleTitle = this.$route.params.title.replace(/\-/g, '/');
      if (articleTitle) {
        const article = this.articles.find(a => a.title == articleTitle);

        this.article = article;
        this.wikitext = article.body;
      }
    },
    loginToWiki(callback) {
      this.$wiki.logIn('Yiddishe Kop', '82117907', callback);
    },
    saveChangesLocal() {
      this.update({
        title: this.article.title,
        body: this.wikitext,
      });
    },
    async syncWikiArticle() {
      await this.saveChangesLocal();
      this.loginToWiki((err, data) => {
        if (err) return;
        this.$wiki.edit(
          this.article.title,
          this.wikitext,
          '!!!נערך ע״י תוכנה שפותח ע״י היידישע קאפ!!!',
          false,
          (err, data) => {
            if (err) return;
            console.log({ data });
          }
        );
      });
    },
  },
  async mounted() {
    this.showArticle();
  },
};
</script>

<style lang="scss">
.wiki {
  a {
    @apply text-blue-300;
  }
}
</style>
