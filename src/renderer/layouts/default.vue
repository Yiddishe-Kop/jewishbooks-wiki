<template>
  <div class="flex flex-col min-h-screen bg-gray-300">
    <div class="pb-32 bg-gray-800">
      <nav class="bg-gray-800">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="border-b border-gray-700">
            <div class="flex items-center justify-between h-16 px-4 sm:px-0">
              <div class="flex items-center">
                <logo class="flex-shrink-0 w-16" />
                <div class="hidden md:block">
                  <div class="flex items-baseline ml-10 space-x-4">
                    <router-link
                      v-for="link in links"
                      :key="link.to"
                      :to="link.to"
                      exact-active-class="text-white bg-gray-900"
                      class="px-3 py-2 text-sm font-medium text-gray-300 rounded-md focus:outline-none focus:text-white focus:bg-gray-700 hover:text-white hover:bg-gray-700"
                    >{{ link.label }}</router-link>
                  </div>
                </div>
              </div>
              <div class="hidden md:block">
                <div class="flex items-center ml-4 md:ml-6">
                  <button
                    class="p-1 text-gray-400 border-2 border-transparent rounded-full hover:text-white focus:outline-none focus:text-white focus:bg-gray-700"
                    aria-label="Notifications"
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
                  <div class="relative ml-3">
                    <div>
                      <button
                        class="flex items-center max-w-xs text-sm text-white rounded-full focus:outline-none focus:shadow-solid"
                        id="user-menu"
                        aria-label="User menu"
                        aria-haspopup="true"
                      >
                        <img
                          class="w-8 h-8 rounded-full shadow-outline-gray"
                          src="https://halpern.yiddishe-kop.com/img/users/NQ5WccXhHPSqLDUbsKWQN6VGMTgMA6dRAJvsRzB9.jpeg/656455b5e11f1cb983323323506df3e213b27167921c9ff70ab04a333d60adfb/NQ5WccXhHPSqLDUbsKWQN6VGMTgMA6dRAJvsRzB9.jpg?w=40&h=40&fit=crop"
                          alt
                        />
                      </button>
                    </div>
                    <!--
                    Profile dropdown panel, show/hide based on dropdown state.

                    Entering: "transition ease-out duration-100"
                      From: "transform opacity-0 scale-95"
                      To: "transform opacity-100 scale-100"
                    Leaving: "transition ease-in duration-75"
                      From: "transform opacity-100 scale-100"
                      To: "transform opacity-0 scale-95"
                    -->
                    <div
                      class="absolute right-0 hidden w-48 mt-2 origin-top-right rounded-md shadow-lg"
                    >
                      <div class="py-1 bg-white rounded-md shadow-xs">
                        <a
                          href="#"
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >Your Profile</a>
                        <a
                          href="#"
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >Settings</a>
                        <a
                          href="#"
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >Sign out</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex -mr-2 md:hidden">
                <!-- Mobile menu button -->
                <button
                  class="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
                >
                  <!-- Menu open: "hidden", Menu closed: "block" -->
                  <svg class="block w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <!-- Menu open: "block", Menu closed: "hidden" -->
                  <svg
                    class="hidden w-6 h-6"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!--
        Mobile menu, toggle classes based on menu state.

        Open: "block", closed: "hidden"
        -->
        <div class="hidden border-b border-gray-700 md:hidden">
          <div class="px-2 py-3 sm:px-3">
            <a
              href="#"
              class="block px-3 py-2 text-base font-medium text-white bg-gray-900 rounded-md focus:outline-none focus:text-white focus:bg-gray-700"
            >Dashboard</a>
            <a
              href="#"
              class="block px-3 py-2 mt-1 text-base font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
            >Team</a>
            <a
              href="#"
              class="block px-3 py-2 mt-1 text-base font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
            >Projects</a>
            <a
              href="#"
              class="block px-3 py-2 mt-1 text-base font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
            >Calendar</a>
            <a
              href="#"
              class="block px-3 py-2 mt-1 text-base font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
            >Reports</a>
          </div>
          <div class="pt-4 pb-3 border-t border-gray-700">
            <div class="flex items-center px-5">
              <div class="flex-shrink-0">
                <img
                  class="w-10 h-10 rounded-full"
                  src="https://halpern.yiddishe-kop.com/img/users/NQ5WccXhHPSqLDUbsKWQN6VGMTgMA6dRAJvsRzB9.jpeg/656455b5e11f1cb983323323506df3e213b27167921c9ff70ab04a333d60adfb/NQ5WccXhHPSqLDUbsKWQN6VGMTgMA6dRAJvsRzB9.jpg?w=40&h=40&fit=crop"
                  alt
                />
              </div>
              <div class="ml-3">
                <div class="text-base font-medium leading-none text-white">Tom Cook</div>
                <div class="mt-1 text-sm font-medium leading-none text-gray-400">tom@example.com</div>
              </div>
            </div>
            <div
              class="px-2 mt-3"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <a
                href="#"
                class="block px-3 py-2 text-base font-medium text-gray-400 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                role="menuitem"
              >Your Profile</a>
              <a
                href="#"
                class="block px-3 py-2 mt-1 text-base font-medium text-gray-400 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                role="menuitem"
              >Settings</a>
              <a
                href="#"
                class="block px-3 py-2 mt-1 text-base font-medium text-gray-400 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                role="menuitem"
              >Sign out</a>
            </div>
          </div>
        </div>
      </nav>
      <header class="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">Title</header>
    </div>

    <main class="flex-1 -mt-32">
      <div
        class="px-4 px-5 py-6 pb-12 mx-auto bg-white rounded-lg shadow max-w-7xl sm:px-6 lg:px-8"
      >
        <slot />
      </div>
    </main>
  </div>
</template>

<script>
import Logo from "../components/Logo";
export default {
  components: { Logo },
  data() {
    return {
      links: [
        {
          to: "/",
          label: "Home"
        },
        {
          to: "/wiki",
          label: "Wikipedia"
        }
      ]
    };
  }
};
</script>
