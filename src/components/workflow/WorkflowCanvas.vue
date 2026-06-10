<template>
  <div class="workflow-canvas" @contextmenu.prevent>
    <VueFlow
      class="editor-flow"
      :nodes="nodes"
      :edges="edgesWithActions"
      :node-types="nodeTypes"
      :edge-types="edgeTypes"
      fit-view-on-init
      :default-viewport="{ zoom: 1 }"
      @connect="onConnect"
      @nodes-change="onNodesChange"
      @edges-change="onEdgesChange"
      @pane-click="onPaneClick"
      @pane-context-menu="(event) => $emit('pane-contextmenu', event)"
      @node-click="(_, node) => $emit('select-node', node.id)"
      @node-context-menu="(event, node) => $emit('node-contextmenu', { event, node })"
      @edge-context-menu="(event, edge) => $emit('edge-contextmenu', { event, edge })"
      @move="onMove"
    >
      <Background pattern-color="#e5e7eb" gap="18" />
      <Controls />
      <MiniMap pannable zoomable />
    </VueFlow>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import StartNode from './nodes/StartNode.vue'
import EndNode from './nodes/EndNode.vue'
import LLMNode from './nodes/LLMNode.vue'
import KnowledgeNode from './nodes/KnowledgeNode.vue'
import IfElseNode from './nodes/IfElseNode.vue'
import CodeNode from './nodes/CodeNode.vue'
import HttpNode from './nodes/HttpNode.vue'
import NoteNode from './nodes/NoteNode.vue'
import CustomEdge from './edges/CustomEdge.vue'

const props = defineProps({
  nodes: {
    type: Array,
    default: () => [],
  },
  edges: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits([
  'connect',
  'nodes-change',
  'edges-change',
  'select-node',
  'pane-click',
  'pane-contextmenu',
  'node-contextmenu',
  'edge-contextmenu',
  'edge-add-node',
  'delete-edge',
  'zoom-change',
])

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  llm: LLMNode,
  knowledge: KnowledgeNode,
  ifElse: IfElseNode,
  code: CodeNode,
  http: HttpNode,
  note: NoteNode,
}

const edgeTypes = {
  custom: CustomEdge,
}

const edgesWithActions = computed(() =>
  // 给每条边注入运行时动作：删除边、在边中间插入节点
  props.edges.map((edge) => ({
    ...edge,
    data: {
      ...edge.data,
      onDelete: (edgeId) => emit('delete-edge', edgeId),
      onAddNode: (payload) => emit('edge-add-node', payload),
    },
  })),
)

const onConnect = (connection) => emit('connect', connection)
const onNodesChange = (changes) => emit('nodes-change', changes)
const onEdgesChange = (changes) => emit('edges-change', changes)
const onPaneClick = () => emit('pane-click')

const { fitView, project } = useVueFlow()

const onMove = ({ viewport }) => {
  emit('zoom-change', Math.round((viewport.zoom || 1) * 100))
}

const fitViewCanvas = () => fitView({ padding: 0.2 })
const toFlowPosition = (point) => project(point)

defineExpose({
  fitViewCanvas,
  toFlowPosition,
})
</script>
