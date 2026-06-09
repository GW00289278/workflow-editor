import { defineStore } from 'pinia'
import { applyEdgeChanges, applyNodeChanges } from '@vue-flow/core'
import { createDefaultWorkflow, createEdge, createNode, parseWorkflow, serializeWorkflow, autoLayout } from '../components/workflow/utils'

export const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    workflowName: '',
    nodes: [],
    edges: [],
    selectedNodeId: '',
    history: [],
    historyIndex: -1,
    suppressHistory: false,
  }),
  getters: {
    selectedNode(state) {
      return state.nodes.find((node) => node.id === state.selectedNodeId) || null
    },
    canUndo(state) {
      return state.historyIndex > 0
    },
    canRedo(state) {
      return state.historyIndex < state.history.length - 1
    },
  },
  actions: {
    init() {
      // 初始化默认示例流程，首次打开即可看到 Start -> LLM -> End
      const initial = createDefaultWorkflow()
      this.workflowName = initial.workflowName
      this.nodes = initial.nodes
      this.edges = initial.edges
      this.selectedNodeId = ''
      this.history = []
      this.historyIndex = -1
      this.recordHistory()
    },
    setWorkflowName(name) {
      this.workflowName = name
      this.recordHistory()
    },
    setSelectedNode(id) {
      this.selectedNodeId = id || ''
    },
    clearSelection() {
      this.selectedNodeId = ''
    },
    addNode(type, position) {
      // Start 节点全局唯一，避免出现多个入口
      if (type === 'start' && this.nodes.some((node) => node.type === 'start')) {
        return null
      }
      const node = createNode(type, position)
      this.nodes = [...this.nodes, node]
      this.selectedNodeId = node.id
      this.recordHistory()
      return node
    },
    duplicateNode(nodeId) {
      const node = this.nodes.find((item) => item.id === nodeId)
      if (!node) return
      const copy = createNode(node.type, { x: node.position.x + 60, y: node.position.y + 60 })
      copy.data = JSON.parse(JSON.stringify(node.data))
      this.nodes = [...this.nodes, copy]
      this.selectedNodeId = copy.id
      this.recordHistory()
    },
    renameNode(nodeId, title) {
      this.nodes = this.nodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, title } } : node))
      this.recordHistory()
    },
    updateNodeConfig(nodeId, configPatch) {
      this.nodes = this.nodes.map((node) => {
        if (node.id !== nodeId) return node
        return {
          ...node,
          data: {
            ...node.data,
            config: {
              ...(node.data?.config || {}),
              ...configPatch,
            },
          },
        }
      })
      this.recordHistory()
    },
    deleteNode(nodeId) {
      this.nodes = this.nodes.filter((node) => node.id !== nodeId)
      this.edges = this.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      if (this.selectedNodeId === nodeId) this.selectedNodeId = ''
      this.recordHistory()
    },
    applyNodes(changes) {
      this.nodes = applyNodeChanges(changes, this.nodes)
      this.recordHistory()
    },
    applyEdges(changes) {
      this.edges = applyEdgeChanges(changes, this.edges)
      this.recordHistory()
    },
    addEdge(connection) {
      if (!connection.source || !connection.target || connection.source === connection.target) return
      const edge = createEdge(connection)
      this.edges = [...this.edges, edge]
      this.recordHistory()
      return edge
    },
    deleteEdge(edgeId) {
      this.edges = this.edges.filter((edge) => edge.id !== edgeId)
      this.recordHistory()
    },
    insertNodeOnEdge(type, edgeMeta, position) {
      const edge = this.edges.find((item) => item.id === edgeMeta.edgeId)
      if (!edge) return
      const node = this.addNode(type, position)
      this.edges = this.edges.filter((item) => item.id !== edge.id)
      this.edges = [
        ...this.edges,
        createEdge({ source: edge.source, sourceHandle: edge.sourceHandle, target: node.id }),
        createEdge({ source: node.id, target: edge.target, targetHandle: edge.targetHandle }),
      ]
      this.recordHistory()
    },
    importWorkflow(jsonText) {
      const parsed = parseWorkflow(jsonText)
      this.workflowName = parsed.workflowName
      this.nodes = parsed.nodes
      this.edges = parsed.edges
      this.selectedNodeId = ''
      this.recordHistory()
    },
    exportWorkflow() {
      return serializeWorkflow({
        workflowName: this.workflowName,
        nodes: this.nodes,
        edges: this.edges,
      })
    },
    autoLayoutNodes() {
      this.nodes = autoLayout(this.nodes)
      this.recordHistory()
    },
    selectAllNodes() {
      this.nodes = this.nodes.map((node) => ({ ...node, selected: true }))
    },
    recordHistory() {
      // 使用快照栈维护撤销/重做历史，和 Dify 的 history store 思路一致
      if (this.suppressHistory) return
      const snapshot = JSON.stringify({ workflowName: this.workflowName, nodes: this.nodes, edges: this.edges })
      if (this.history[this.historyIndex] === snapshot) return
      this.history = this.history.slice(0, this.historyIndex + 1)
      this.history.push(snapshot)
      this.historyIndex += 1
    },
    undo() {
      if (!this.canUndo) return
      this.historyIndex -= 1
      this.restoreFromHistory()
    },
    redo() {
      if (!this.canRedo) return
      this.historyIndex += 1
      this.restoreFromHistory()
    },
    restoreFromHistory() {
      const snapshot = this.history[this.historyIndex]
      if (!snapshot) return
      const parsed = JSON.parse(snapshot)
      this.suppressHistory = true
      this.workflowName = parsed.workflowName
      this.nodes = parsed.nodes
      this.edges = parsed.edges
      this.suppressHistory = false
    },
  },
})
