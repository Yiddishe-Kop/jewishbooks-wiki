<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-md">
    <ul class="divide-y divide-gray-400">
      <li v-for="item in items" :key="item.id">
        <router-link
          :to="`/articles/${encodeURIComponent(item.title)}/${item.id}`"
          class="block transition duration-150 ease-in-out hover:bg-gray-80 focus:outline-none focus:bg-gray-80"
        >
          <div class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="text-lg font-bold leading-5 text-gray-800 truncate">
                {{ item.title }}
              </div>
              <div @click.stop.prevent="$emit('delete', item.id)" class="flex flex-shrink-0 mr-2">
                <span
                  title="מחק"
                  class="inline-flex px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full"
                >
                  <icon name="trash" class="w-5" />
                </span>
              </div>
            </div>
            <div class="mt-2 sm:flex sm:justify-between">
              <div class="sm:flex">
                <div class="ml-6 text-sm leading-5 text-gray-500">
                  {{ item.summary }}
                </div>
              </div>
              <div class="flex items-center mt-2 text-sm text-gray-500 sm:mt-0">
                <icon name="calendar" class="w-4 ml-1" />
                <span>
                  {{ new Date(item.updatedAt).toLocaleDateString() }}
                </span>
              </div>
            </div>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'WideList',
  props: ['items'],
};
</script>

<style>
</style>
