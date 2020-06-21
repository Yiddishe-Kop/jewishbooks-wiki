<template>
  <div class="vueWikitext" v-html="html" @click.prevent="interceptLinks"></div>
</template>

<script>
import wiky from '../helpers/parser/wiky';
import fuzeSearch from '../helpers/search';

export default {
  name: 'VueWikitext',
  props: {
    source: {
      type: String,
      default: '',
    },
  },
  computed: {
    html() {
      return wiky.toHtml(this.source);
    },
  },
  methods: {
    interceptLinks(e) {
      if (e.target.localName == 'a') {
        const title = decodeURIComponent(e.target.pathname).replace(/^\//, '');
        const results = fuzeSearch.search(title);
        console.log({ title }, results);
        if (results.length) {
          this.$router.push(`/articles/${encodeURIComponent(results[0].title)}/${results[0].pageid}`);
        }
      }
    },
  },
};
</script>

<style lang="scss">
.vueWikitext {
  @apply font-sbl text-xl text-justify;
  strong {
    @apply font-siddur text-2xl;
  }
  h1 {
    @apply font-siddur mt-6 mb-2 text-4xl font-extrabold text-gray-800;
  }
  h2 {
    @apply font-siddur mt-6 mb-2 text-3xl font-bold text-gray-800;
  }
  h3 {
    @apply mt-5 mb-1 font-bold text-2xl;
  }
  h3 {
    @apply mt-3 mb-1 font-bold text-xl;
  }
  p {
    @apply leading-7 mb-4;
  }
  a {
    @apply underline text-blue-700;
    &:hover {
      @apply text-blue-500;
    }
  }
  // הערות
  sup {
    @apply px-1 relative text-teal-700 font-black font-sans cursor-pointer;
    .fn-popup {
      pointer-events: none;
      opacity: 0;
      line-height: 1.3;
      position: absolute;
      border: 1px solid;
      padding: 8px;
      top: 8px;
      max-height: 142px;
      overflow-y: auto;
      width: 180px;
      white-space: normal;
      z-index: 20;
      transition: all 0.2s ease;
      @apply absolute right-0 p-2 bg-gray-800 text-gray-100 rounded shadow text-sm;
    }
    &:hover .fn-popup {
      pointer-events: all;
      opacity: 1;
    }
  }
  blockquote {
    @apply mt-4 mb-5 py-3 px-3 bg-blue-100 border-l-4 border-blue-400 rounded-r-md;
    p {
      @apply mb-0;
    }
  }
  ol {
    @apply my-5 pl-5 list-decimal;
  }
  ul {
    @apply my-5 pl-5 list-disc;
  }
  img {
    @apply my-8 rounded-md;
  }
}
</style>
