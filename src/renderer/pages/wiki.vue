<template>
  <div class="py-8">
    <h1>ברוכים הבאים למגרש המשחקים שלנו!</h1>
    <input
      @keyup.enter="searchWikipedia"
      v-model="query"
      class="w-full px-4 py-2 mt-2 text-white bg-gray-700 rounded-md shadow"
      placeholder="חפש כל מה שעולה על דעתך..."
    />

    <section class="mt-4 wiki">
      <div class="p-3 mt-2 overflow-x-auto rounded-lg shadow">
        <div v-if="!!result.parse" class="grid grid-cols-2 gap-8">
          <textarea v-model="wikitext"></textarea>
          <vue-wikitext :source="wikitext" />
        </div>
        <div
          v-else-if="!!result.error"
          v-html="result.error.info"
          class="my-16 text-sm text-center text-red-500"
        ></div>
        <div v-else class="my-16 text-center text-gray-400">התוצאות יוצגו כאן</div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "wikipedia",
  data() {
    return {
      query: "מסכת שבת",
      wikitext: "",
      result: {}
    };
  },
  methods: {
    async searchWikipedia() {
      const URL = "wiki.jewishbooks.org.il/mediawiki/api.php";
      let res = await (
        await fetch(
          `https://${URL}?
            action=parse&
            page=${this.query}&
            format=json&
            utf8=1&
            prop=wikitext&
            maxlag=500&
            origin=*`,
          {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              Origin: "http://localhost:3000/wikipedia"
            }
          }
        )
      ).json();
      this.result = res;
      this.wikitext = res.parse.wikitext["*"];
    }
  },
  mounted() {
    this.searchWikipedia();
  }
};
</script>

<style lang="scss">
.wiki {
  a {
    @apply text-blue-300;
  }
}
</style>
