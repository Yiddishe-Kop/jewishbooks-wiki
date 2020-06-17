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
      </div>
    </div>

    <section class="mt-12 wiki">
      <div v-if="!!wikitext" class="relative bg-white">
        <vue-wikitext
          :source="wikitext"
          class="w-full min-h-screen p-4 pt-6 bg-transparent form-input focus:outline-none"
        />
      </div>
      <div v-else-if="!!error" v-html="error" class="my-16 text-sm text-center text-red-500"></div>
      <div v-else class="text-center text-gray-400 my-36">דף זה לא שמור במחשב שלך</div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Show',
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

<style lang="scss">
.wiki {
  a {
    @apply text-blue-300;
  }
}
</style>
