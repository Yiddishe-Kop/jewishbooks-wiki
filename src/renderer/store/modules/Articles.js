const electron = require('electron').remote

const state = {
  articles: [],
  categories: []
}

const mutations = {
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  SET_ARTICLES(state, articles) {
    state.articles = articles
  },
  CREATE_ARTICLE(state, article) {
    state.articles.push(article)
  },
  UPDATE_ARTICLE(state, article) {
    state.articles = [
      ...state.articles.filter(a => a.title != article.title),
      article
    ]
  },
  DELETE_ARTICLE(state, title) {
    state.articles = state.articles.filter(a => a.title != title)
  }
}

const actions = {
  setCategories: ({ commit }, categories) => {
    commit('SET_CATEGORIES', categories)
  },
  setArticles: ({ commit }, articles) => {
    commit('SET_ARTICLES', articles)
  },
  store({ commit }, article) {
    commit('CREATE_ARTICLE', article)
  },
  update({ commit }, article) {
    commit('UPDATE_ARTICLE', article)
  },
  destroy({ commit }, title) {
    electron.dialog.showMessageBox(electron.getCurrentWindow(), {
      type: 'warning',
      buttons: ['Cancel', 'Delete'],
      defaultId: 0,
      title: `Delete article`,
      message: `Are you sure you want to delete ${title}?`,
      detail: 'This is irreversible.',
    }).then(({ response }) => {
      if (response === 1) commit('DELETE_ARTICLE', title)
    }).catch(e => console.log({ e }))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
