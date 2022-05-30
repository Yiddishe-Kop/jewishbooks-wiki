import Vue from 'vue';
import Fuse from 'fuse.js';
import uniqBy from 'lodash/uniqBy';

class JewishBooks {
  categoryTree = [];
  rootCategories = Vue.observable([]);
  loading = false;
  fuzeSearch;

  async buildCategoryTree() {
    // this.categoryTree = catTree;
    if (this.loading || this.categoryTree.length) return;
    this.loading = true;

    this.categoryTree = await (await fetch('static/categoryTree.json')).json();
    this.rootCategories = this.categoryTree.map(cat => cat.title);
    this.pages = this.flattenPages();

    this.fuzeSearch = new Fuse(this.pages, {
      threshold: 0.3,
      keys: ['title'],
    });
    console.log(this.fuzeSearch);

    this.loading = false;
  }

  flattenPages = function() {
    const flattenObject = ob => {
      var toReturn = {};

      for (var i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if (typeof ob[i] == 'object') {
          var flatObject = flattenObject(ob[i]);
          for (var x in flatObject) {
            if (!flatObject.hasOwnProperty(x)) continue;

            toReturn[i + '.' + x] = flatObject[x];
          }
        } else {
          toReturn[i] = ob[i];
        }
      }
      return toReturn;
    };
    let flattened = flattenObject(this.categoryTree);

    let searchList = [];
    for (let key in flattened) {
      if (flattened[key] == 'page') {
        let pageid = key.replace('type', 'pageid');
        searchList.push({
          title: flattened[key.replace('type', 'title')],
          pageid: flattened[pageid],
        });
      }
    }
    return uniqBy(searchList, 'pageid');
  };
}

export default new JewishBooks();
