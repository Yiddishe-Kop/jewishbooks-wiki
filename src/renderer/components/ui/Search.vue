<template>
  <transition name="modal-fade">
    <div
      v-show="isOpen"
      class="fixed inset-0 z-50 flex items-start justify-center px-4 pt-16 sm:pt-24"
      style="z-index: 9999;"
    >
      <!-- overlay -->
      <div @click="close" class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-600 opacity-75"></div>
      </div>

      <!-- Modal -->
      <div
        class="relative w-full max-w-lg overflow-hidden transition-all transform bg-gray-900 rounded-lg shadow-2xl modal"
      >
        <input
          @keydown.tab.prevent=""
          @keydown.prevent.stop.enter="go()"
          @keydown.prevent.arrow-up="selectUp()"
          @keydown.prevent.arrow-down="selectDown()"
          @keyup.esc="close()"
          ref="search"
          v-model="search"
          type="text"
          style="caret-color: #6b7280"
          class="w-full px-6 py-4 text-lg text-gray-300 placeholder-gray-500 bg-transparent appearance-none focus:outline-none"
          placeholder="חפש משהו..."
        />
        <div class="border-t border-gray-800" v-show="results.length > 0">
          <ul ref="results" style="max-height: 265px;" class="overflow-y-auto">
            <li v-for="(item, i) in results" :key="item.pageid">
              <div
                @click="go(url(item.title, item.pageid))"
                class="flex items-center px-6 py-2 cursor-pointer"
                :class="{ 'bg-gray-700': selected === i, 'hover:bg-gray-800': selected !== i }"
              >
                <span
                  :class="{ 'text-gray-300': selected !== i, 'text-white': selected === i }"
                  class="ml-3 mr-4 font-bold"
                >
                  {{ item.title }}
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div class="flex items-center justify-between px-3 py-1 text-xs leading-4 text-gray-300 bg-gray-800">
          <div>פתח באמצעות <span dir="ltr">⌘F</span></div>
          <div dir="ltr">Open with ⌘F</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Fuse from 'fuse.js';
import catTree from '../../assets/categoryTree.json';
import throttle from 'lodash/throttle';
import uniqBy from 'lodash/uniqBy';

// The Fuse instance [fuzzy search]
let fuse;

export default {
  name: 'Search',
  props: ['isOpen'],
  data() {
    return {
      categoryTree: catTree,
      search: '',
      results: [],
      selected: 0,
    };
  },
  watch: {
    search: {
      handler: throttle(function(newVal) {
        const results = fuse.search(this.search);
        this.results = results.slice(0, 20);
        if (newVal.length == 0) {
          this.selected = 0;
        }
      }, 200),
    },
    isOpen(isOpen) {
      this.search = '';
      setTimeout(() => {
        this.$refs.search.focus();
      }, 100);
    },
  },
  methods: {
    url(title, id) {
      return `/articles/${encodeURIComponent(title)}/${id}`;
    },
    open() {
      this.$emit('update:is-open', true);
    },
    close() {
      this.$emit('update:is-open', false);
    },
    selectUp() {
      this.selected = Math.max(0, this.selected - 1);
      this.$nextTick(() => {
        this.$refs.results.children[Math.max(0, this.selected - 1)].scrollIntoView({
          block: 'nearest',
        });
      });
    },
    selectDown() {
      this.selected = Math.min(this.results.length - 1, this.selected + 1);
      if (this.results.length > this.selected + 1) {
        this.$nextTick(() => {
          this.$refs.results.children[this.selected + 1].scrollIntoView({
            block: 'nearest',
          });
        });
      }
    },
    go(url) {
      const item = this.results[this.selected];
      this.$router.push(url || this.url(item.title, item.pageid));
      this.close();
    },
    normalizedSearchList() {
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
      console.log(Object.keys(flattened).length);

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
    },
  },
  created() {
    const searchList = this.normalizedSearchList();
    fuse = new Fuse(searchList, {
      threshold: 0.3,
      keys: ['title'],
    });
  },
};
</script>

<style lang="scss">
.modal-fade-enter-active,
.modal-fade-leave-active {
  opacity: 1;
  transition: all 0.3s ease-in;
  .modal {
    transform: none;
    transition: all 0.3s ease;
  }
}
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
  .modal {
    transform: scale(0.8);
  }
}
</style>
