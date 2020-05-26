import { Article } from '../../../db';
const state = {
  articles: []
}

const mutations = {
  SET_ARTICLES(state, articles) {
    state.articles = articles
  },
}

const actions = {
  setArticles: ({ commit }, articles) => {
    // do something async
    commit('SET_ARTICLES', articles)
  },
  refreshArticles({ commit }) {
    const allArticles = Article.findAll().then(allArticles => {
      commit('SET_ARTICLES', allArticles)
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
