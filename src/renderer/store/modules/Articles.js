const electron = require('electron').remote

const state = {
  articles: [],
  changes: []
}

const mutations = {

  // ARTICLES
  CREATE_ARTICLE(state, article) {
    state.articles.push(article)
  },
  UPDATE_ARTICLE(state, article) {
    state.articles = [
      ...state.articles.filter(a => a.id != article.id),
      article
    ]
  },
  DELETE_ARTICLE(state, id) {
    state.articles = state.articles.filter(a => a.id != id)
  },

  // CHANGES
  UPDATE_OR_CREATE_CHANGE(state, change) {
    state.changes = [
      ...state.changes.filter(c => c.id != change.id),
      change
    ]
  },
  DELETE_CHANGE(state, id) {
    state.changes = state.changes.filter(c => c.id != id)
  }
}

const actions = {

  // ARTICLES
  getArticle: ({ state }, id) => {
    return state.articles.find(a => a.id == id)
  },
  async store({ dispatch, commit }, article) {
    if (await dispatch('getArticle', article.id)) return // it's already saved
    commit('CREATE_ARTICLE', article)
  },
  update({ commit }, { article, change }) {
    commit('UPDATE_OR_CREATE_CHANGE', change)
    commit('UPDATE_ARTICLE', article)
  },
  destroy({ commit }, id) {
    electron.dialog.showMessageBox(electron.getCurrentWindow(), {
      type: 'warning',
      buttons: ['Cancel', 'Delete'],
      defaultId: 0,
      title: `Delete article`,
      message: `Are you sure you want to delete the article?`,
      detail: 'This is irreversible.',
    }).then(({ response }) => {
      if (response === 1) commit('DELETE_ARTICLE', id)
    }).catch(e => console.log({ e }))
  },

  // CHANGES
  getChange: ({ state }, id) => {
    return state.changes.find(a => a.id == id)
  },
  deleteChange: ({ commit }, id) => {
    if (window.confirm('האם אתה רוצה למחוק את השינויים לעמוד זה?')) {
      commit('DELETE_CHANGE', id)
    }
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
