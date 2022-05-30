import openLoginWindow from '../../helpers/login';
import { ipcRenderer, remote } from 'electron';

const state = {
  auth: {
    user: null,
  },
  online: false,
};

const mutations = {
  LOGIN_USER(state, user) {
    state.auth = {
      user: user,
    };
  },
  LOGOUT(state) {
    state.auth.user = null;
  },
  GO_ONLINE(state) {
    state.online = true;
  },
  GO_OFFLINE(state) {
    state.online = false;
  },
};

const actions = {
  showLogin() {
    openLoginWindow();
  },
  loginUser: ({ commit }, user) => {
    commit('LOGIN_USER', user);
    ipcRenderer.send('login', user);
    remote.getCurrentWindow().close();
  },
  logoutUser({ commit }) {
    remote.dialog
      .showMessageBox(remote.getCurrentWindow(), {
        type: 'warning',
        buttons: ['Cancel', 'Logout'],
        defaultId: 0,
        title: `Logout`,
        message: `Are you sure you want to log out from your account?`,
      })
      .then(({ response }) => {
        if (response === 1) commit('LOGOUT');
      })
      .catch(e => console.log({ e }));
  },
  goOnline({ commit }) {
    commit('GO_ONLINE');
  },
  goOffline({ commit }) {
    commit('GO_OFFLINE');
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
