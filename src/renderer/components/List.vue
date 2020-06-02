<template>
  <ul class="overflow-hidden bg-gray-100 shadow sm:rounded-md">
    <li
      v-for="(item, i) in list"
      :key="item.pageid"
      @click="select(item, i)"
      class="block transition duration-150 ease-in-out cursor-pointer select-none hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
      :class="{ active: selected === i }"
    >
      <div class="flex items-center px-4 py-4 sm:px-6">
        <div class="flex items-center flex-1 min-w-0">
          <div v-if="checkbox" class="flex-shrink-0">
            <input
              type="checkbox"
              @change="$emit('check', { value: $event.target.checked, category: item.title, i })"
              class="form-input"
            />
          </div>
          <div class="flex-1 min-w-0 px-4 md:grid md:grid-cols-2 md:gap-4">
            <div class="flex items-center">
              <div
                class="font-bold leading-5 text-gray-700 whitespace-no-wrap siddur"
                :class="{
                  'text-3xl -mt-4': size == 'large',
                  'text-2xl -mt-3': size == 'medium',
                  'text-xl -mt-1': size == 'small',
                }"
              >
                {{ item.title.replace('קטגוריה:', '') }}
              </div>
              <span class="mr-2 font-sans text-sm font-light leading-5 text-gray-500 whitespace-no-wrap english"
                >/ {{ item.title }}</span
              >
            </div>
          </div>
        </div>
        <div v-if="item.type == 'subcat'" class="actions">
          <svg class="w-5 h-5 text-gray-700 transform rotate-180" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div v-else-if="item.type == 'page'" class="flex items-center">
          <span class="relative z-0 inline-flex shadow-sm">
            <router-link
              v-if="isSaved(item.pageid)"
              :to="`/articles/${encodeURIComponent(item.title)}/${item.pageid}`"
              class="relative inline-flex items-center px-2 py-2 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500"
            >
              <icon name="eye" class="w-5 h-5 text-gray-500" />
            </router-link>
            <button
              v-else
              @click="downloadArticle(item.pageid)"
              class="relative inline-flex items-center px-2 py-2 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500"
            >
              <icon name="download" class="w-5 h-5 text-gray-500" />
            </button>
          </span>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { getArticle } from '../helpers/wiki';

export default {
  name: 'List',
  props: ['list', 'size', 'checkbox'],
  data() {
    return {
      selected: null,
    };
  },
  computed: {
    ...mapState('Articles', ['articles']),
  },
  methods: {
    ...mapActions('Articles', ['store']),
    isSaved(id) {
      return !!this.articles.find(a => a.id == id);
    },
    async downloadArticle(id) {
      const pageContent = await getArticle(id);
      console.log(`Downloaded page ${id}...`);
      this.store({
        id,
        content: pageContent,
      });
    },
    select(item, i) {
      this.selected = i;
      this.$emit('select', item);
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  li.active {
    @apply bg-gray-200 border-r-2 border-brand;
    &:hover {
      @apply bg-gray-300;
    }
    &:focus {
      @apply bg-gray-200;
    }
  }
  li.active,
  li:hover {
    svg {
      @apply text-brand;
    }
  }
  .english {
    transition: opacity 0.8s ease;
    opacity: 0;
  }
  &:hover {
    .english {
      opacity: 1;
    }
  }
  .actions {
    @apply p-2 rounded-lg bg-white;
  }
}
</style>
