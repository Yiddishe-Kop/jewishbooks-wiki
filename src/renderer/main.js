require('win-ca')
import { ipcRenderer } from "electron";

import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import wikiAPI from './helpers/wiki'
import JewishBooks from './helpers/JewishBooks'


import Loader from './components/ui/Loader'
import Icon from './components/ui/Icon'
import './assets/app.scss'


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('loader', Loader)
Vue.component('icon', Icon)
Vue.prototype.$wiki = new wikiAPI();
Vue.prototype.$jewishBooks = JewishBooks;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  mounted() {
    ipcRenderer.on("login", (event, user) => {
      this.$store.commit('App/LOGIN_USER', user);
    });
  }
}).$mount('#app')
