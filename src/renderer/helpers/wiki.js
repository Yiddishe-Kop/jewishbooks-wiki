import util from 'util'
import bot from 'nodemw'

const Bot = new bot({
  protocol: "https",
  server: "wiki.jewishbooks.org.il",
  path: "/mediawiki",
  port: 443,
  debug: true
});

const API_LIMIT = 5000;

export const getAllTalkPages = (callback) => {
  Bot.log('Getting all talk pages...');
  Bot.getAll(

    {
      action: 'query',
      list: 'allpages',
      apfilterredir: 'nonredirects', // do not include redirects
      apnamespace: 1,
      aplimit: API_LIMIT
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
    cmlimit: API_LIMIT,
  },
    'categorymembers',
    callback
  );
})

export const getPagesInCategory = util.promisify((category, callback) => {
  Bot.log(`Getting pages from ${category}...`);

  Bot.getAll(
    {
      action: 'query',
      list: 'categorymembers',
      cmtitle: category,
      cmlimit: API_LIMIT
    },
    'categorymembers',
    callback
  );
})

export const getArticle = util.promisify((title, callback) => {
  let params = {
    action: 'query',
    prop: 'revisions',
    rvprop: 'content',
    rand: Bot.getRand()
  };

  // both page ID or title can be provided
  if (typeof title === 'number') {
    Bot.log(`Getting content of article #${title}...`);
    params.pageids = title;
  } else {
    Bot.log(`Getting content of ${title}...`);
    params.titles = title;
  }

  Bot.api.call(params, function (err, data) {
    if (err) {
      callback(err);
      return;
    }

    const page = getFirstItem(data.pages),
      revision = page.revisions && page.revisions.shift(),
      content = revision && revision['*'],
      redirectInfo = data.redirects && data.redirects.shift() || undefined;

    callback(null, content, redirectInfo);
  });
})

// get the object being the first key/value entry of a given object
function getFirstItem(obj) {
  const key = Object.keys(obj).shift();
  return obj[key];
}

export default Bot
