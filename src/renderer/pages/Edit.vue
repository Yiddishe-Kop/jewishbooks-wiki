<template>
  <div class="py-8">
    <p class="text-gray-600">כאן אפשר לערוך דף ויקי גם אופליין</p>

    <div class="flex items-center justify-between space-x-2">
      <div>
        <h1 class="text-3xl font-black text-gray-800">
          <icon name="template" class="inline-block w-6" />
          עריכת: {{ title }}
        </h1>
        <p v-if="change">
          <span class="text-sm">
            <span class="text-gray-500">עריכה אחרונה:</span>
            <span>{{ new Date(change.updatedAt).toLocaleDateString() }}</span>
          </span>
          <span class="mr-4">{{ change.summary }}</span>
        </p>
      </div>
      <div class="relative flex whitespace-no-wrap">
        <router-link
          :to="`/articles/${encodeURIComponent(title)}/${article.id}`"
          class="flex items-center p-2 ml-2 text-red-500 transition bg-red-100 rounded-md shadow hover:bg-red-200"
        >
          <span>חזור</span>
        </router-link>
        <button
          @click="summary.show = true"
          class="flex items-center p-2 ml-2 text-green-500 transition bg-green-100 rounded-md shadow hover:bg-green-200"
        >
          <icon name="save" class="inline-block w-5 ml-2" />
          <span>שמור שינויים</span>
        </button>
        <div v-if="summary.show" class="absolute z-20 w-64 p-2 font-semibold rounded shadow-xl bg-gray-80 top-11">
          <h4>אנא הזן סיכום עריכה:</h4>
          <textarea
            type="text"
            v-model="summary.message"
            class="w-full form-input"
            placeholder="אנא רשום כאן סיכום עריכה"
          ></textarea>
          <div class="flex items-center justify-end mt-2">
            <button @click="cancelChanges" class="px-2 ml-2 text-indigo-600 bg-indigo-100 rounded">בטל</button>
            <button @click="saveChangesLocal" class="px-2 text-white bg-indigo-700 rounded">שמור</button>
          </div>
        </div>
        <button
          v-if="online"
          @click="syncWikiArticle"
          class="flex items-center p-2 text-blue-500 transition bg-blue-100 rounded-md shadow hover:bg-blue-200"
        >
          <icon name="refresh" class="inline-block w-5 ml-2" />
          <span>סנכרן שינויים</span>
        </button>
      </div>
    </div>

    <section class="mt-12 wiki">
      <div v-if="!!wikitext" class="relative flex items-stretch">
        <span
          class="absolute top-0 right-0 px-3 mr-2 text-sm font-semibold leading-5 text-green-600 transform -translate-y-1/2 bg-green-100 border-2 border-green-700 rounded-full"
        >
          עריכה
        </span>
        <textarea
          v-model="wikitext"
          class="w-full min-h-screen p-4 pt-6 ml-4 bg-white form-input focus:outline-none"
        ></textarea>
        <div class="relative w-full min-h-screen p-4 pt-6 bg-white rounded">
          <span
            class="absolute top-0 right-0 px-3 mr-2 text-sm font-semibold leading-5 text-blue-600 transform -translate-y-1/2 bg-blue-100 border-2 border-blue-700 rounded-full"
          >
            תצוגה
          </span>
          <vue-wikitext :source="wikitext" />
        </div>
      </div>
      <div v-else-if="!!error" v-html="error" class="my-16 text-sm text-center text-red-500"></div>
      <div v-else class="text-center text-gray-400 my-36">דף זה לא שמור במחשב שלך</div>
    </section>
  </div>
</template>

<script>
import VueWikitext from '../components/VueWikitext';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Edit',
  components: { VueWikitext },
  data() {
    return {
      article: {},
      wikitext: '',
      error: '',
      change: undefined,
      summary: {
        show: false,
        message: '',
      },
    };
  },
  computed: {
    ...mapState('Articles', ['articles']),
    ...mapState('App', ['online', 'auth']),
    title() {
      return decodeURIComponent(this.$route.params.title);
    },
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    ...mapActions('Articles', ['getArticle', 'getChange', 'deleteChange', 'update']),
    async showArticle() {
      const article = await this.getArticle(this.$route.params.id);

      if (article) {
        this.article = article;
        this.wikitext = article.content;
        this.refreshChange();
      }
    },
    async refreshChange() {
      let change = await this.getChange(this.article.id);
      if (change) {
        this.change = change;
        this.summary.message = this.change.summary;
      } else {
        this.change = undefined;
      }
    },
    async saveChangesLocal() {
      if (!this.summary.message) return;
      this.summary.show = false;
      this.update({
        article: {
          id: this.article.id,
          content: this.wikitext,
        },
        change: {
          title: this.title,
          id: this.article.id,
          summary: this.summary.message,
          updatedAt: new Date(),
        },
      });
      this.refreshChange();
    },
    cancelChanges() {
      this.summary.show = false;
    },
    async syncWikiArticle() {
      await this.saveChangesLocal();
      try {
        const loginResult = await this.$wiki.logIn(this.auth.user.name, this.auth.user.password);
        const editResult = await this.$wiki.edit(this.title, this.wikitext, this.summary.message, false);
        await this.deleteChange({ id: this.change.id, force: true }); // delete the local change after uploading
        this.refreshChange();
        console.log({ loginResult, editResult });
        window.alert('העמוד נשמר בהצלחה!');
      } catch (err) {
        console.error(err);
      }
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
