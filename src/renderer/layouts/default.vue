<template>
  <div class="flex items-stretch h-screen" dir="rtl">
    <div class="flex flex-col items-center px-2 py-4 bg-gray-900 draggable">
      <logo class="flex-shrink-0 w-16" />
      <nav class="my-8 space-y-6">
        <router-link
          v-for="link in links"
          :key="link.to.name"
          :to="link.to"
          exact-active-class="text-teal-400 bg-teal-900 no-drag shadow-outline-teal hover:bg-teal-800"
          class="block relative p-1.5 bg-gray-800 text-gray-200 shadow-outline-gray rounded-full hover:bg-gray-700 transition"
        >
          <icon :name="link.icon" class="w-6" />
          <span
            v-if="link.count"
            style="top: 3px; right: 3px;"
            class="absolute px-1.5 text-xs font-semibold text-gray-700 transform translate-x-1/2 -translate-y-1/2 bg-gray-100 rounded-full"
          >
            {{ link.count }}
          </span>
        </router-link>
      </nav>
    </div>
    <section class="h-full p-1 overflow-y-auto bg-gray-400" style="width: 220px">
      <h1 class="mt-4 text-xl font-semibold">קטגוריות</h1>
      <ul v-if="$jewishBooks.rootCategories.length" class="mt-3 space-y-1">
        <li v-for="(cat, i) in $jewishBooks.rootCategories" :key="cat">
          <router-link
            exact-active-class="text-teal-800 bg-teal-100 hover:bg-teal-200"
            :to="{ name: 'home', query: { cat: i } }"
            class="block p-2 transition bg-gray-100 rounded hover:bg-teal-50"
          >
            {{ cat.replace('קטגוריה:', '') }}
          </router-link>
        </li>
      </ul>
      <div v-else class="py-10 mt-4 text-center">
        <p class="text-sm text-gray-600">אין לך עמודים שמורים</p>
      </div>
    </section>
    <div class="flex flex-col flex-1 overflow-hidden bg-white">
      <!-- TOP BAR -->
      <nav class="bg-gray-800 border-b border-gray-700 draggable">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="flex items-center justify-end h-16 px-4 sm:px-0">
            <div class="w-3 h-3 ml-4 rounded-full" :class="online ? 'bg-green-400' : 'bg-orange-400'"></div>
            <div class="flex items-center">
              <button
                @click="searchIsOpen = !searchIsOpen"
                class="p-1 text-gray-400 border-2 border-transparent rounded-full focus:outline-none hover:text-white focus:focus:outline-none focus:text-white focus:bg-gray-700"
                aria-label="Search"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                  />
                </svg>
              </button>

              <!-- Profile dropdown -->
              <user-avatar />
            </div>
          </div>
        </div>
      </nav>

      <main class="flex-1 overflow-auto bg-gray-200">
        <div class="px-4 px-5 py-6 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <slot />
        </div>
      </main>
    </div>
    <search :is-open.sync="searchIsOpen" />
  </div>
</template>

<script>
import Logo from '../components/Logo';
import Search from '../components/ui/Search';
import UserAvatar from '../components/ui/UserAvatar';
import { mapState, mapActions } from 'vuex';

export default {
  components: { Logo, Search, UserAvatar },
  data() {
    return {
      searchIsOpen: false,
    };
  },
  computed: {
    ...mapState('App', ['online']),
    ...mapState('Articles', ['changes']),
    links() {
      return [
        {
          to: { name: 'home' },
          label: 'בית',
          icon: 'home',
        },
        {
          to: { name: 'changes' },
          label: 'העריכות שלי',
          icon: 'collection',
          count: this.changes.length,
        },
        {
          to: { name: 'settings' },
          label: 'הגדרות',
          icon: 'cog',
        },
      ];
    },
  },
  methods: {
    ...mapActions('App', ['goOnline', 'goOffline']),
    monitorOnlineStatus() {
      navigator.onLine ? this.goOnline() : this.goOffline();
    },
  },
  async mounted() {
    window.addEventListener('online', this.monitorOnlineStatus);
    window.addEventListener('offline', this.monitorOnlineStatus);
    window.addEventListener('open-search', () => (this.searchIsOpen = true));
    this.monitorOnlineStatus();
    await this.$jewishBooks.buildCategoryTree();
  },
};
</script>

<style>
.draggable {
  -webkit-user-select: none;
  -webkit-app-region: drag;
}
.no-drag {
  -webkit-user-select: auto;
  -webkit-app-region: no-drag;
}
</style>
