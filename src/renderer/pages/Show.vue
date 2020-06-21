<template>
  <div class="py-8">
    <p class="text-gray-600">לימוד בסטנדר</p>

    <div class="flex items-center justify-between space-x-2">
      <div>
        <h1 class="text-3xl font-black text-gray-800">
          <icon name="template" class="inline-block w-6" />
          {{ title }}
        </h1>
        <p v-if="change">
          <span class="text-sm">
            <span class="text-gray-500">עריכה אחרונה:</span>
            <span>{{ new Date(change.updatedAt).toLocaleDateString() }}</span>
          </span>
          <span class="mr-4">{{ change.summary }}</span>
        </p>
      </div>
      <div class="relative flex">
        <router-link
          :to="`/articles/${encodeURIComponent(title)}/${article.id}/edit`"
          class="flex items-center p-2 mr-2 font-bold text-blue-500 transition bg-blue-100 rounded-md shadow hover:bg-blue-200"
        >
          <icon name="pencil" class="inline-block w-5 ml-2" />
          <span>ערוך</span>
        </router-link>
        <button @click="destroy(id)" class="mr-2">
          <icon name="trash" class="inline-block w-5 ml-2 text-red-500" />
        </button>
      </div>
    </div>

    <section class="mt-12 wiki">
      <div v-if="!!wikitext" class="relative bg-white rounded shadow">
        <vue-wikitext :source="wikitext" class="w-full min-h-screen p-8" />
      </div>
      <div v-else-if="!!error" v-html="error" class="my-16 text-sm text-center text-red-500"></div>
      <div v-else class="text-center text-gray-500 my-36">
        <p>דף זה לא שמור במחשב שלך</p>
        <button v-if="online" @click="downloadArticle" class="p-2 mt-4 text-center text-blue-500">
          <icon name="download" class="block w-8 h-8 mx-auto" />
          <p>הורד עכשיו</p>
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import VueWikitext from '../components/VueWikitext';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Show',
  components: { VueWikitext },
  data() {
    return {
      article: {},
      wikitext: '',
      error: '',
      change: undefined,
      summary: {
        show: false,
        message: '!!!נערך ע״י תוכנה שפותח ע״י היידישע קאפ!!!',
      },
    };
  },
  computed: {
    ...mapState('Articles', ['articles']),
    ...mapState('App', ['online', 'auth']),
    title() {
      return decodeURIComponent(this.$route.params.title);
    },
    id() {
      return Number(this.$route.params.id);
    },
  },
  methods: {
    ...mapActions('Articles', ['getArticle', 'getChange', 'deleteChange', 'update', 'store', 'destroy']),
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    async showArticle() {
      const article = await this.getArticle(this.id);
      if (article) {
        this.article = article;
        this.wikitext = article.content;
        this.refreshChange();
      } else {
        this.article = {};
        this.wikitext = '';
        this.change = undefined;
      }
    },
    async downloadArticle() {
      if (!this.online) return;
      const pageContent = await this.$wiki.getArticle(this.id);
      console.log(`Downloaded page ${this.title}...`, { pageContent });
      const article = {
        id: this.id,
        content: pageContent,
      };
      this.article = article;
      this.wikitext = pageContent;
      this.change = undefined;
      this.$store.dispatch('Articles/store', article);
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
