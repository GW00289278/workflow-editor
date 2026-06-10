<template>
  <BaseEdge :path="path" />
  <EdgeLabelRenderer>
    <div
      :style="{ transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)` }"
      class="edge-actions nodrag nopan"
    >
      <el-button circle size="small" @click="handleAdd">+</el-button>
      <el-button circle size="small" type="danger" @click="handleDelete">×</el-button>
    </div>
  </EdgeLabelRenderer>
</template>

<script setup>
import { computed } from 'vue'
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@vue-flow/core'

const props = defineProps({
  id: String,
  sourceX: Number,
  sourceY: Number,
  targetX: Number,
  targetY: Number,
  sourcePosition: String,
  targetPosition: String,
  source: String,
  sourceHandle: String,
  target: String,
  targetHandle: String,
  data: {
    type: Object,
    default: () => ({}),
  },
})

const edgePath = computed(() =>
  getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
    sourcePosition: props.sourcePosition,
    targetPosition: props.targetPosition,
  }),
)

const path = computed(() => edgePath.value[0])
const labelX = computed(() => edgePath.value[1])
const labelY = computed(() => edgePath.value[2])

const handleDelete = () => {
  props.data?.onDelete?.(props.id)
}

const handleAdd = () => {
  props.data?.onAddNode?.({
    edgeId: props.id,
    source: props.source,
    sourceHandle: props.sourceHandle,
    target: props.target,
    targetHandle: props.targetHandle,
    x: labelX.value,
    y: labelY.value,
  })
}
</script>
