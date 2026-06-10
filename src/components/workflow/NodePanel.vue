<template>
  <div class="node-panel" :class="{ floating }" :style="panelStyle">
    <div class="node-panel-title">节点选择器</div>
    <div class="node-panel-list">
      <button
        v-for="item in items"
        :key="item.type"
        class="node-panel-item"
        type="button"
        @click="$emit('select', item.type)"
      >
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { NODE_DEFINITIONS } from './constants'

const props = defineProps({
  floating: Boolean,
  x: Number,
  y: Number,
})

defineEmits(['select'])

const items = computed(() =>
  Object.entries(NODE_DEFINITIONS).map(([type, definition]) => ({
    type,
    label: definition.label,
    icon: definition.icon,
  })),
)

const panelStyle = computed(() =>
  props.floating
    ? {
        left: `${props.x || 0}px`,
        top: `${props.y || 0}px`,
      }
    : undefined,
)
</script>
