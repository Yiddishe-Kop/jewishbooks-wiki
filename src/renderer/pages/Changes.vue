<template>
  <div>
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
          העריכות שלי
        </h2>
        <p class="text-gray-600">רשימת העריכות שלך שעדיין לא הועלו לאתר</p>
      </div>
      <div class="flex mt-4 mr-4">
        <span class="mr-3 rounded-md shadow-sm">
          <button
            @click="syncAllWikiArticles"
            :class="[
              online
                ? 'bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700'
                : 'bg-indigo-100',
            ]"
            class="inline-flex items-center px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md"
          >
            <icon name="upload-cloud" class="w-5 ml-2" />
            העלה כל השינויים
          </button>
        </span>
      </div>
    </div>

    <task-progress percentageDone="73" label="מעלה" currentTitle="helloooo!" class="mt-4" />

    <wide-list v-if="myChanges.length" class="mt-8" :items="myChanges" @delete="deleteChange"></wide-list>
    <div v-else class="py-32 mt-8 text-center bg-gray-100 rounded-lg">
      <p class="text-gray-400">אין שינויים</p>
    </div>
  </div>
</template>

<script>
import WideList from '../components/ui/WideList';
import TaskProgress from '../components/ui/TaskProgress';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Changes',
  components: { WideList, TaskProgress },
  computed: {
    ...mapState('App', ['auth', 'online']),
    ...mapState('Articles', ['articles', 'changes']),
    myChanges() {
      return this.changes.map(c => {
        return {
          ...c,
          article: this.articles.find(a => a.id == c.id),
        };
      });
    },
  },
  methods: {
    ...mapActions('Articles', ['deleteChange']),
    async syncAllWikiArticles() {
      try {
        const loginResult = await this.$wiki.logIn(this.auth.user.name, this.auth.user.password);
        await this.changes.forEach(async change => {
          const article = this.articles.find(a => a.id == change.id);
          const editResult = await this.$wiki.edit(change.title, article.content, change.summary, false);
          console.log({ loginResult, editResult });
        });
        window.alert('העמודים נשמרו בהצלחה!');
      } catch (err) {
        window.alert('שגיאה בהעלאת השינויים שלך:\n' + err);
        console.error(err);
      }
    },
  },
};
</script>

<style>
</style>
