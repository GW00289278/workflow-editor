<template>
  <div class="base-node" :class="{ selected }" :style="{ borderColor: color }">
    <Handle v-if="hasTarget" type="target" position="left" />
    <div class="node-header" :style="{ backgroundColor: color }">
      <el-icon><component :is="icon" /></el-icon>
      <span>{{ title }}</span>
    </div>
    <div class="node-content">
      <slot />
    </div>
    <Handle v-if="hasSource" type="source" position="right" />
    <template v-if="hasConditionalSources">
      <Handle id="true" type="source" position="right" :style="{ top: '36%' }" />
      <Handle id="false" type="source" position="right" :style="{ top: '64%' }" />
      <span class="handle-label handle-true">T</span>
      <span class="handle-label handle-false">F</span>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Handle } from '@vue-flow/core'
import { NODE_DEFINITIONS, NODE_TYPES } from '../constants'

const props = defineProps({
  selected: Boolean,
  type: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    default: () => ({}),
  },
})

const definition = computed(() => NODE_DEFINITIONS[props.type] || {})
const color = computed(() => definition.value.color || '#64748b')
const icon = computed(() => definition.value.icon)
const title = computed(() => props.data?.title || definition.value.label || 'Node')
const hasTarget = computed(() => ![NODE_TYPES.START, NODE_TYPES.NOTE].includes(props.type))
const hasSource = computed(() => ![NODE_TYPES.END, NODE_TYPES.IF_ELSE, NODE_TYPES.NOTE].includes(props.type))
const hasConditionalSources = computed(() => props.type === NODE_TYPES.IF_ELSE)
</script>
