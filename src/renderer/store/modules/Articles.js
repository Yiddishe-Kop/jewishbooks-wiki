const Storage = require('electron-store');
const electron = require('electron')

const schema = {
  articles: {
    type: 'array',
    default: []
  },
};

const storage = new Storage({
  schema,
  name: 'articles' // filename
});

const state = {
  articles: storage.get('articles')
}

const mutations = {
  SET_ARTICLES(state, articles) {
    state.articles = articles
  },
  CREATE_ARTICLE(state, article) {
    state.articles.push(article)
    storage.set('articles', state.articles)
  },
  UPDATE_ARTICLE(state, article) {
    state.articles = [
      ...state.articles.filter(a => a.title != article.title),
      article
    ]
    storage.set('articles', state.articles)
  },
  DELETE_ARTICLE(state, title) {
    state.articles = state.articles.filter(a => a.title != title)
    storage.set('articles', state.articles)
  }
}

const actions = {
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
    electron.dialog.showMessageBox(undefined, {
      type: 'warning',
      buttons: ['Cancel', 'Delete'],
      defaultId: 0,
      noLink: true,
      title: `Delete article`,
      message: `Are you sure you want to delete ${title}?`,
      detail: 'This is irreversible.',
    }).then(function (res) {
      console.log(res);
      if (res === 1) commit('DELETE_ARTICLE', title)
    }).catch(e => console.log({ e }))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
