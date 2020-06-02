<template>
  <div class="py-8">
    <p class="text-gray-600">כאן אפשר לערוך דף ויקי גם אופליין</p>

    <div class="flex items-center justify-between space-x-2">
      <div>
        <h1 class="text-3xl font-black text-gray-800">{{ decodeURIComponent($route.params.title) }}</h1>
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
          v-if="online"
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
        <div class="relative">
          <span
            class="absolute top-0 right-0 px-3 mr-2 text-sm font-semibold leading-5 text-green-600 transform -translate-y-1/2 bg-green-100 border-2 border-green-700 rounded-full"
            >עריכה</span
          >
          <textarea
            v-model="wikitext"
            class="w-full h-full p-4 pt-6 bg-transparent form-input focus:outline-none"
          ></textarea>
        </div>
        <div class="relative p-1 bg-gray-100 rounded shadow-md">
          <span
            class="absolute top-0 right-0 px-3 mr-2 text-sm font-semibold leading-5 text-blue-600 transform -translate-y-1/2 bg-blue-100 border-2 border-blue-700 rounded-full"
            >תצוגה מקדימה</span
          >
          <vue-wikitext :source="wikitext" class="p-4 pt-6" />
        </div>
      </div>
      <div v-else-if="!!error" v-html="error" class="my-16 text-sm text-center text-red-500"></div>
      <div v-else class="text-center text-gray-400 my-36">דף זה לא שמור במחשב שלך</div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Edit',
  data() {
    return {
      article: {},
      wikitext: '',
      error: '',
    };
  },
  computed: {
    ...mapState('Articles', ['articles']),
    ...mapState('App', ['online']),
  },
  methods: {
    ...mapActions('Articles', ['getArticle', 'update']),
    async showArticle() {
      const article = await this.getArticle(this.$route.params.id);

      if (article) {
        this.article = article;
        this.wikitext = article.content;
      }
    },
    loginToWiki(callback) {
      this.$wiki.logIn('Yiddishe Kop', '82117907', callback);
    },
    saveChangesLocal() {
      this.update({
        title: this.article.title,
        content: this.wikitext,
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
  watch: {
    $route(to, from) {
      this.showArticle();
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
