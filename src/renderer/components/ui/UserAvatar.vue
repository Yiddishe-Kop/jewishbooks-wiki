<template>
  <div class="relative mr-3">
    <div v-if="!!user" class="flex items-center">
      <button
        @click="open = !open"
        class="max-w-xs overflow-hidden text-sm rounded-full focus:outline-none focus:shadow-outline"
      >
        <span class="inline-flex items-center justify-center w-10 h-10 bg-gray-500 rounded-full">
          <span class="font-medium leading-none text-white">{{ initials(user.name) }}</span>
        </span>
      </button>
    </div>
    <span
      v-else
      @click="showLogin"
      class="inline-block w-8 h-8 overflow-hidden bg-blue-100 rounded-full outline-none cursor-pointer focus:shadow-outline"
      tabindex="0"
    >
      <svg class="w-full h-full text-blue-400" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </span>
    <dropdown v-if="!!user && open" :items="dropdownItems" @sign-out="logoutUser" @open-settings="openSettings">
      <div class="px-4 py-2 bg-indigo-100 border-b border-indigo-300">
        <p class="text-xs leading-4 text-indigo-400">שלום עליכם,</p>
        <p class="text-sm font-medium leading-5 text-indigo-900">{{ user.name }}</p>
      </div>
    </dropdown>
  </div>
</template>

<script>
import Dropdown from '@/components/ui/Dropdown';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'UserAvatar',
  components: { Dropdown },
  data() {
    return {
      open: false,
      dropdownItems: [
        [
          {
            label: 'הגדרות',
            onClick: 'open-settings',
            iconPath: `<path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path>`,
          },
        ],
        [
          {
            label: 'יציאה',
            iconViewBox: '0 0 24 24',
            onClick: 'sign-out',
            iconPath: `<path d="M11 4h3a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0V6h-2v12h2v-2a1 1 0 0 1 2 0v3a1 1 0 0 1-1 1h-3v1a1 1 0 0 1-1.27.96l-6.98-2A1 1 0 0 1 2 19V5a1 1 0 0 1 .75-.97l6.98-2A1 1 0 0 1 11 3v1z"></path><path class="secondary" d="M18.59 11l-1.3-1.3c-.94-.94.47-2.35 1.42-1.4l3 3a1 1 0 0 1 0 1.4l-3 3c-.95.95-2.36-.46-1.42-1.4l1.3-1.3H14a1 1 0 0 1 0-2h4.59z"></path>`,
          },
        ],
      ],
    };
  },
  methods: {
    ...mapActions('App', ['showLogin', 'logoutUser']),
    openSettings() {
      this.$router.push('/settings');
    },
    initials(name) {
      return name.split(' ').reduce((acc, val) => {
        if (val) {
          return (acc += val[0]);
        } else {
          return acc;
        }
      }, '');
    },
  },
  computed: {
    ...mapState('App', {
      user: state => state.auth.user,
    }),
  },
};
</script>

<style>
</style>
