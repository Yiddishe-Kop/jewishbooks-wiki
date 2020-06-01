<template>
  <li class="relative p-4 transition bg-gray-200 rounded-lg hover:bg-blue-50">
    <h2>{{ article.title }}</h2>
    <router-link :to="`/articles/${encodeURIComponent(article.title)}`" class="absolute inset-0 z-10" />
    <button
      @click.stop="$emit('delete')"
      class="relative z-20 p-2 mt-3 text-sm font-semibold text-red-500 transition bg-red-100 rounded-md focus:outline-none hover:bg-red-200"
    >
      <icon name="trash" class="w-6" />
    </button>
  </li>
</template>

<script>
export default {
  name: 'ArticleCard',
  props: ['article'],
};
</script>

<style>
</style>
