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
  name: 'app' // filename
});

const state = {
  auth: storage.get('auth')
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
  }
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
  }
}

storage.onDidChange('auth.user', newUser => {
  if (newUser) {
    console.log('firing login...');

    const store = require('..')
    store.dispatch('App/loginUser', newUser)
  }
})

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
