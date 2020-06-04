<template>
  <div>
    <div class="flex items-center justify-between text-gray-500">
      <div>
        {{ label }}:
        <span class="text-gray-900">{{ currentTitle }}</span>
      </div>
      <div class="text-gray-900">{{ percentageDone }}%</div>
    </div>
    <div class="h-3 progress">
      <span class="block h-full bar" :class="[barColor]" :style="`width: ${percentageDone}%`"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskProgress',
  props: ['label', 'currentTitle', 'total', 'done'],
  data() {
    return {};
  },
  computed: {
    percentageDone() {
      return ((this.done / this.total) * 100).toFixed(0);
    },
    barColor() {
      const colors = ['bg-red-400', 'bg-orange-400', 'bg-blue-400', 'bg-green-400'];
      return colors[this.convertRange(this.percentageDone, [0, 100], [0, colors.length - 1]).toFixed(0)];
    },
  },
  methods: {
    convertRange(value, r1, r2) {
      return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
    },
  },
};
</script>

<style lang="scss">
.progress {
  transition: all 0.3s ease;
  @apply rounded-full bg-gray-300 shadow-inner overflow-hidden;
  .bar {
    transition: all 0.3s ease;
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.35) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.35) 50%,
      rgba(255, 255, 255, 0.35) 75%,
      transparent 75%,
      transparent
    );
    background-size: 1rem 1rem;
  }
}
</style>
