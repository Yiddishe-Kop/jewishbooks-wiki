<template>
  <transition name="menu">
    <div
      class="absolute left-0 z-10 w-48 mt-2 overflow-hidden text-gray-700 origin-top-left bg-white rounded-md shadow-lg top-full"
    >
      <slot />
      <div
        v-for="(group, i) in items"
        :key="i"
        :class="{ 'border-b': i < items.length - 1 }"
        class="py-1 border-gray-200"
      >
        <div
          v-for="link in group"
          :key="link.label"
          @click.prevent="handleClick(link.onClick)"
          class="flex items-center px-4 py-2 text-sm leading-5 cursor-pointer group focus:outline-none"
          :class="[
            link.color == 'red'
              ? 'text-red-700 hover:bg-red-100 hover:text-red-900 focus:bg-red-100 focus:text-red-900'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900',
          ]"
        >
          <svg
            class="w-5 h-5 menu-icon"
            :class="[
              link.color == 'red'
                ? 'text-red-500 group-hover:text-red-600 group-focus:text-red-600'
                : 'text-gray-500 group-hover:text-gray-600 group-focus:text-gray-600',
            ]"
            fill="currentColor"
            :viewBox="link.iconViewBox || '0 0 20 20'"
            v-html="link.iconPath"
          />
          {{ link.label }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Dropdown',
  props: ['items'],
  methods: {
    handleClick(methodName) {
      methodName && this.$emit(methodName);
    },
  },
};
</script>

<style>
.menu-icon {
  margin-inline-end: 0.75rem;
}

.menu-enter-active,
.menu-leave-active {
  transition: all 0.15s ease;
}
.menu-enter,
.menu-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
</style>
