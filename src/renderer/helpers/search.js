import JewishBooks from '../helpers/JewishBooks'
import Fuse from 'fuse.js';

export default new Fuse(JewishBooks.pages, {
  threshold: 0.3,
  keys: ['title'],
});
