import Vue from 'vue';
import Vuex from 'vuex';

import { createPersistedState } from './vuex-electron';
import modules from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  strict: false,
  plugins: [
    createPersistedState(),
    // createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production',
});
