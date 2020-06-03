import util from 'util'
import Bot from 'nodemw'

/**
 *  WikiAPI Class
 *  -----------------------------------------------------------------------------------------
 *  I created my own little wrapper around the `nodemw` library - for 2 main reasons:
 *  1. To convert callback based methods to Promise based
 *  2. To add some methods that weren't available in the library / more control on the params
 *  -----------------------------------------------------------------------------------------
 */
class wikiAPI {

  /**
   * The API results limit for one request
   */
  API_LIMIT = 5000;

  /**
   * The instance of the wiki Bot.
   * I instantiate it here (vs in the constructor) as we need to use it in defining some methods.
   */
  Bot = new Bot({
    protocol: "https",
    server: "wiki.jewishbooks.org.il",
    path: "/mediawiki",
    port: 443,
    debug: true
  })

  /**
   * Login the user to the wiki
   * @param {string} username
   * @param {string} password
   */
  logIn = util.promisify(this.Bot.logIn).bind(this.Bot)

  /**
   * Edit a page on the wiki
   * @param {string} title - Page title.
   * @param {string} content - Page content
   * @param {string} summary - Summary message
   * @param {boolean} minor - If it's a minor edit
   */
  edit = util.promisify(this.Bot.edit).bind(this.Bot)

  /**
   * Get all Talk pages in the wiki
   */
  getAllTalkPages = util.promisify(callback => {
    this.Bot.log('Getting all talk pages...');
    this.Bot.getAll({
      action: 'query',
      list: 'allpages',
      apfilterredir: 'nonredirects', // do not include redirects
      apnamespace: 1,
      aplimit: this.API_LIMIT
    },
      'allpages',
      callback
    );
  });

  /**
   * Get all Subcategories of a category
   * @param {string} catTitle - The category title
   */
  getSubcategories = util.promisify((catTitle, callback) => {
    this.Bot.log('Getting category tree...');
    this.Bot.getAll({
      action: 'query',
      list: 'categorymembers',
      cmtitle: catTitle,
      cmprop: 'ids|title|type',
      cmlimit: this.API_LIMIT,
    },
      'categorymembers',
      callback
    );
  });

  /**
   * Get all pages of a category
   * @param {string} category - The category title
   */
  getPagesInCategory = util.promisify((category, callback) => {
    this.Bot.log(`Getting pages from ${category}...`);

    this.Bot.getAll({
      action: 'query',
      list: 'categorymembers',
      cmtitle: category,
      cmlimit: this.API_LIMIT
    },
      'categorymembers',
      callback
    );
  });

  /**
  * Get content of a page
  * @param {string|number} title - The page title | page id
  */
  getArticle = util.promisify((title, callback) => {
    let params = {
      action: 'query',
      prop: 'revisions',
      rvprop: 'content',
      rand: this.Bot.getRand()
    };

    // both page ID or title can be provided
    if (typeof title === 'number') {
      this.Bot.log(`Getting content of article #${title}...`);
      params.pageids = title;
    } else {
      this.Bot.log(`Getting content of ${title}...`);
      params.titles = title;
    }

    this.Bot.api.call(params, function (err, data) {
      if (err) {
        callback(err);
        return;
      }

      const page = this.getFirstItem(data.pages),
        revision = page.revisions && page.revisions.shift(),
        content = revision && revision['*'],
        redirectInfo = data.redirects && data.redirects.shift() || undefined;

      callback(null, content, redirectInfo);
    });
  });

  // get the object being the first key/value entry of a given object
  getFirstItem(obj) {
    const key = Object.keys(obj).shift();
    return obj[key];
  }
}




export default new wikiAPI()
