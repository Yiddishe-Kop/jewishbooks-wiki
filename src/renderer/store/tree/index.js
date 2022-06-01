import Store from 'electron-store';
import categoryTree from '../../../../static/categoryTree.json';

const store = new Store({
  name: 'tree',
  clearInvalidConfig: true,
  defaults: {
    tree: categoryTree,
  },
});

export default store;