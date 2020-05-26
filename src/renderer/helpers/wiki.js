import bot from 'nodemw'

export default new bot({
  protocol: "https",
  server: "wiki.jewishbooks.org.il",
  path: "/mediawiki",
  debug: true
});
