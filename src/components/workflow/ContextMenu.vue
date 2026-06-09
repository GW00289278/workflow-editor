<template>
  <ul v-if="visible" class="context-menu" :style="{ left: `${x}px`, top: `${y}px` }">
    <li v-for="item in items" :key="item.key" @click="item.action()">{{ item.label }}</li>
  </ul>
</template>

<script setup>
defineProps({
  visible: Boolean,
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
  items: {
    type: Array,
    default: () => [],
  },
})
</script>
