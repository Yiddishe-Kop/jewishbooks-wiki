<template>
  <div class="flex items-center justify-center h-screen px-8 bg-gray-800 titlebar" dir="rtl">
    <div class="flex flex-col items-center p-6 text-gray-100 rounded-md">
      <div class="text-center">
        <logo class="inline-block w-12 h-auto mx-auto" :rotate="false" />
        <h1 class="mt-2 text-xl font-thin text-gray-400">אוצר הספרים השיתופי</h1>
        <h2 class="mt-2 text-5xl font-extrabold leading-9 text-center text-gray-200 siddur">
          ברוכים הבאים!
        </h2>
        <p class="mt-8 text-sm leading-5 text-center text-gray-500">
          כדי ליהנות מכל הפונקציות <br />יש להיכנס עם החשבון שלכם
        </p>
      </div>
      <div class="mt-8 rounded-md shadow-sm no-drag w-72">
        <div>
          <input
            v-model="name"
            ref="usernameInput"
            aria-label="Username"
            required
            class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none bg-gray-80 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
            placeholder="שם משתמש"
          />
        </div>
        <div class="-mt-px">
          <input
            v-model="password"
            aria-label="Password"
            type="password"
            required
            class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none bg-gray-80 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
            placeholder="סיסמה"
          />
        </div>
        <p v-if="err" class="mt-1 text-xs text-red-500">{{ err }}</p>
      </div>

      <div v-if="!isLoading" class="mt-6 no-drag w-72">
        <button
          @click="attemptLogin"
          class="relative flex justify-center w-full px-4 py-2 text-sm font-bold leading-5 text-white transition duration-150 ease-in-out bg-blue-600 border border-transparent rounded-md group hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700"
        >
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <icon
              name="lock"
              class="w-5 h-5 text-blue-500 transition duration-150 ease-in-out group-hover:text-blue-400"
            />
          </span>
          כניסה
        </button>
        <button
          @click="createAccount"
          class="relative flex justify-center w-full px-4 py-2 mt-3 text-sm font-bold leading-5 text-white transition duration-150 ease-in-out bg-blue-600 border border-transparent rounded-md group hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700"
        >
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <icon
              name="lock"
              class="w-5 h-5 text-blue-500 transition duration-150 ease-in-out group-hover:text-blue-400"
            />
          </span>
          יצירת חשבון
        </button>
      </div>
      <loader v-else class="mt-3 light" />
    </div>
  </div>
</template>

<script>
import Logo from '../components/Logo';
import Loader from '../components/ui/Loader';
import { mapActions } from 'vuex';

export default {
  name: 'Login',
  components: { Logo, Loader },
  data() {
    return {
      name: '',
      password: '',
      err: '',
      isLoading: false,
    };
  },
  methods: {
    ...mapActions('App', ['loginUser']),
    async attemptLogin() {
      this.isLoading = true;
      this.err = '';
      try {
        const loginResult = await this.$wiki.logIn(this.name, this.password);
        this.loginUser({ name: this.name, password: this.password });
      } catch (err) {
        this.err = err;
      }
      this.isLoading = false;
    },
    createAccount() {
      this.isLoading = true;
      this.err = '';
      this.$wiki.Bot.createAccount(this.name, this.password, (err, res) => {
        this.isLoading = false;
        if (err) {
          this.err = err;
          return;
        }
        this.loginUser({ name: this.name, password: this.password });
      });
    },
  },
  mounted() {
    this.$refs.usernameInput.focus();
  },
};
</script>

<style>
</style>
