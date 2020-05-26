import bot from "nodemw";

const Wiki = new bot({
  protocol: "https",
  server: "wiki.jewishbooks.org.il",
  path: "/mediawiki",
  debug: true
});

const state = {
  Wiki: Wiki
}

const mutations = {
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
