import util from 'util'
import bot from 'nodemw'

const Bot = new bot({
  protocol: "https",
  server: "wiki.jewishbooks.org.il",
  path: "/mediawiki",
  port: 443,
  debug: true
});

export const getAllTalkPages = (callback) => {
  Bot.log('Getting all talk pages...');
  Bot.getAll(

    {
      action: 'query',
      list: 'allpages',
      apfilterredir: 'nonredirects', // do not include redirects
      apnamespace: 1,
      aplimit: 5000
    },
    'allpages',
    callback
  );
}

export const getSubcategories = util.promisify((catTitle, callback) => {
  Bot.log('Getting category tree...');
  Bot.getAll({
    action: 'query',
    list: 'categorymembers',
    cmtitle: catTitle,
    cmprop: 'ids|title|type',
    cmlimit: 5000,
  },
    'categorymembers',
    callback
  );
})

export default Bot
