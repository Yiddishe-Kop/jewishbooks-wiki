import catTree from '../assets/categoryTree.json';
import uniqBy from 'lodash/uniqBy';

class JewishBooks {
  constructor() {
    this.categoryTree = catTree;
    this.pages = this.flattenPages();
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
