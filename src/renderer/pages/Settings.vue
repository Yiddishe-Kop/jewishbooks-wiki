<template>
  <div>
    <div class="flex-1 min-w-0">
      <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
        <icon name="cog" class="inline-block w-6" />
        הגדרות
      </h2>
      <p class="text-gray-600">הגדרות והעדפות של התוכנה</p>
    </div>

    <div class="px-4 py-5 mt-6 bg-white shadow sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">סנכרון לענן</h3>
          <p class="mt-1 text-sm leading-5 text-gray-500">
            שמור על נתונים מקומיים מעודכנים.
          </p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <fieldset>
            <legend class="text-base font-medium leading-6 text-gray-900">עדכון עץ קטגוריות ראשי</legend>
            <div class="mt-4">
              <span class="inline-flex rounded-md shadow-sm">
                <button
                  @click="rebuildCategoryTree"
                  class="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50"
                >
                  <span v-if="!isLoading">עדכן עכשיו</span>
                  <loader v-else class="inline" />
                </button>
              </span>
              <p v-if="isLoading" class="mt-1 text-sm leading-5 text-gray-700">מוריד: {{ currentlyLoading }}</p>
              <p class="mt-1 text-sm leading-5 text-gray-500">
                פעולה זה מצריך חיבור לרשת ועלול לקחת זמן
              </p>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fs from 'fs';
import path from 'path';

export default {
  name: 'Settings',
  data() {
    return {
      isLoading: false,
      currentlyLoading: '',
      cachedCats: {},
    };
  },
  methods: {
    async writeFile(data) {
      this.isLoading = true;
      fs.writeFileSync(path.join(__dirname, '../assets/categoryTree.json'), JSON.stringify(data));
      this.isLoading = false;
    },
    async rebuildCategoryTree() {
      if (this.isLoading) {
        this.isLoading = false;
        return;
      }
      this.isLoading = true;
      const rootCats = await this.$wiki.getSubcategories('קטגוריה:עץ קטגוריות ראשי');

      // debugging =====================
      const isDebug = false;
      const limit = 12;
      let level = 0;
      // ===============================

      const getChildren = async cats => {
        if (isDebug && level > limit) return cats;
        level++;
        console.log(`level ${level} ${level <= limit || !isDebug}`);
        if (cats.some(cat => cat.type == 'subcat' && !cat.subcats)) {
          console.log('diving deeper...', cats);
          try {
            for (const cat of cats) {
              if (cat.type == 'subcat') {
                // this.progress.current = cat.title;
                let subcats = [];
                let cachedCat = this.cachedCats[cat.title];
                this.currentlyLoading = cat.title;
                if (cachedCat) {
                  // we already fetched these from the server
                  if (cachedCat.visited) {
                    // we already fetched these from cache - STOP! we have an infinite loop!
                    console.log('TERMINATING INFINITE LOOP', cat.title);
                    return cachedCat.subcats;
                  }
                  console.log('...Using cache', cat.title);
                  cachedCat.visited = true; // my solution to overcome infinite loops in category relations
                  subcats = cachedCat.subcats; // use from cache
                } else {
                  console.log('...Fetching fresh', cat.title);
                  subcats = await this.$wiki.getSubcategories(cat.title); // THE ACTUAL WORK - fetch category members
                  // add to cache
                  this.cachedCats[cat.title] = {
                    ...cat,
                    subcats,
                  };
                }
                cat.subcats = await getChildren(subcats); // recursively fetch children
              }
            }
          } catch (err) {
            console.error('inner', err);
          }
        } else {
          // this.progress.current = cats.length ? cats[0].title : '---';
          console.log('coming out...', cats);
        }
        return cats;
      };

      try {
        const catTree = await getChildren(rootCats);
        console.log('Saving file...', catTree);
        !isDebug && this.writeFile(catTree);
      } catch (err) {
        console.error('inner', err);
      }
      this.isLoading = false;
      // this.progress.current = undefined;
    },
  },
};
</script>

<style>
</style>
