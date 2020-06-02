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
          <div v-if="icon" class="flex-shrink-0">
            <icon icon="book" class="text-3xl text-gray-400" />
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
        <div v-else class="flex items-center">
          <span class="relative z-0 inline-flex shadow-sm">
            <a
              :href="`/torah/${item.firstSection || item.heTitle}`"
              class="relative inline-flex items-center px-2 py-2 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-r-md hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </a>
            <a
              :href="`/torah/${item.heTitle}?index=true`"
              class="relative inline-flex items-center px-2 py-2 -ml-px text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-l-md hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </a>
          </span>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'List',
  props: ['list', 'size', 'icon'],
  data() {
    return {
      selected: null,
    };
  },
  methods: {
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
