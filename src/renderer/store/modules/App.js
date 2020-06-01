import openLoginWindow from '../../helpers/login';
const Storage = require('electron-store');
import { ipcRenderer, remote } from "electron";

const schema = {
  auth: {
    type: 'object',
    default: {
      user: null
    }
  },
};

const storage = new Storage({
  schema,
  name: 'app', // filename
  // encryptionKey: 'iwerfliuelwieculqwup03902o2ndwefdn'
});

const state = {
  auth: storage.get('auth'),
  online: false
}

const mutations = {
  LOGIN_USER(state, user) {
    state.auth = {
      user: user
    }
  },
  LOGOUT(state) {
    storage.set('auth.user', null)
    state.auth.user = null
  },
  GO_ONLINE(state) {
    state.online = true
  },
  GO_OFFLINE(state) {
    state.online = false
  },
}

const actions = {
  showLogin() {
    openLoginWindow()
  },
  loginUser: ({ commit }, user) => {
    storage.set('auth.user', user)
    commit('LOGIN_USER', user)
    ipcRenderer.send("login", user);
    remote.getCurrentWindow().close()
  },
  logoutUser({ commit }) {
    remote.dialog.showMessageBox(remote.getCurrentWindow(), {
      type: 'warning',
      buttons: ['Cancel', 'Logout'],
      defaultId: 0,
      title: `Logout`,
      message: `Are you sure you want to log out from your account?`,
    }).then(({ response }) => {
      if (response === 1) commit('LOGOUT')
    }).catch(e => console.log({ e }))
  },
  goOnline({ commit }) {
    commit('GO_ONLINE')
  },
  goOffline({ commit }) {
    commit('GO_OFFLINE')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
