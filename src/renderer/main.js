import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import Loader from './components/ui/Loader'
import Icon from './components/ui/Icon'
import VueWikitext from 'vue-wikitext'
import './assets/app.scss'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(VueWikitext)
Vue.component('loader', Loader)
Vue.component('icon', Icon)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
