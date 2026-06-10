<template>
  <div class="workflow-editor" @click="hideContextMenu">
    <Header
      :workflow-name="store.workflowName"
      :can-undo="store.canUndo"
      :can-redo="store.canRedo"
      :zoom-percent="zoomPercent"
      @update-name="store.setWorkflowName"
      @import="onImport"
      @export="onExport"
      @undo="store.undo"
      @redo="store.redo"
      @fit-view="fitView"
      @run="onRun"
    />

    <div class="workflow-main">
      <NodePanel @select="addNodeFromPanel" />

      <WorkflowCanvas
        ref="canvasRef"
        :nodes="store.nodes"
        :edges="store.edges"
        @connect="store.addEdge"
        @nodes-change="store.applyNodes"
        @edges-change="store.applyEdges"
        @select-node="store.setSelectedNode"
        @pane-click="store.clearSelection"
        @pane-contextmenu="onPaneContextMenu"
        @node-contextmenu="onNodeContextMenu"
        @edge-contextmenu="onEdgeContextMenu"
        @edge-add-node="onEdgeAddNode"
        @delete-edge="store.deleteEdge"
        @zoom-change="onZoomChange"
      />

      <ConfigPanel
        :node="store.selectedNode"
        @rename="(value) => store.renameNode(store.selectedNodeId, value)"
        @update-config="(patch) => store.updateNodeConfig(store.selectedNodeId, patch)"
        @delete="store.deleteNode(store.selectedNodeId)"
      />
    </div>

    <NodePanel
      v-if="showFloatingNodePanel"
      floating
      :x="floatingPanelPosition.x"
      :y="floatingPanelPosition.y"
      @select="onSelectFloatingNode"
    />

    <ContextMenu :visible="menu.visible" :x="menu.x" :y="menu.y" :items="menu.items" />

    <input ref="fileInputRef" type="file" accept="application/json" class="hidden-input" @change="handleFileImport" />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useWorkflowStore } from '../../stores/workflow'
import Header from './Header.vue'
import NodePanel from './NodePanel.vue'
import WorkflowCanvas from './WorkflowCanvas.vue'
import ConfigPanel from './ConfigPanel.vue'
import ContextMenu from './ContextMenu.vue'
import { serializeWorkflow, runWorkflowMock } from './utils'

const store = useWorkflowStore()
store.init()

const canvasRef = ref(null)
const fileInputRef = ref(null)
const zoomPercent = ref(100)
const showFloatingNodePanel = ref(false)
const floatingPanelPosition = ref({ x: 0, y: 0 })
const pendingEdge = ref(null)
const pendingCanvasPosition = ref(null)

const menu = reactive({
  visible: false,
  x: 0,
  y: 0,
  items: [],
})

const hideContextMenu = () => {
  menu.visible = false
}

// 统一处理缩放回调，便于顶部工具栏实时展示缩放百分比
const onZoomChange = (value) => {
  zoomPercent.value = value
}

const openNodePicker = (clientX, clientY) => {
  showFloatingNodePanel.value = true
  floatingPanelPosition.value = { x: clientX, y: clientY }
}

const addNodeFromPanel = (type) => {
  store.addNode(type, { x: 220, y: 220 })
}

const onSelectFloatingNode = (type) => {
  if (pendingEdge.value) {
    const pos = pendingCanvasPosition.value || { x: 360, y: 220 }
    store.insertNodeOnEdge(type, pendingEdge.value, pos)
  } else {
    const pos = pendingCanvasPosition.value || { x: 320, y: 220 }
    store.addNode(type, pos)
  }

  showFloatingNodePanel.value = false
  pendingEdge.value = null
  pendingCanvasPosition.value = null
}

const onPaneContextMenu = (event) => {
  hideContextMenu()
  pendingEdge.value = null
  pendingCanvasPosition.value = canvasRef.value?.toFlowPosition({ x: event.clientX, y: event.clientY })
  menu.visible = true
  menu.x = event.clientX
  menu.y = event.clientY
  menu.items = [
    {
      key: 'add',
      label: '添加节点',
      action: () => {
        openNodePicker(event.clientX, event.clientY)
        hideContextMenu()
      },
    },
    {
      key: 'layout',
      label: '整理布局',
      action: () => {
        store.autoLayoutNodes()
        hideContextMenu()
      },
    },
    {
      key: 'selectAll',
      label: '全选节点',
      action: () => {
        store.selectAllNodes()
        hideContextMenu()
      },
    },
  ]
}

const onNodeContextMenu = ({ event, node }) => {
  hideContextMenu()
  store.setSelectedNode(node.id)
  menu.visible = true
  menu.x = event.clientX
  menu.y = event.clientY
  menu.items = [
    {
      key: 'copy',
      label: '复制节点',
      action: () => {
        store.duplicateNode(node.id)
        hideContextMenu()
      },
    },
    {
      key: 'rename',
      label: '重命名节点',
      action: async () => {
        try {
          const result = await ElMessageBox.prompt('请输入新的节点名称', '重命名', {
            inputValue: node.data?.title,
          })
          store.renameNode(node.id, result.value)
        } catch (_error) {
          // 用户取消输入无需处理
        }
        hideContextMenu()
      },
    },
    {
      key: 'delete',
      label: '删除节点',
      action: () => {
        store.deleteNode(node.id)
        hideContextMenu()
      },
    },
  ]
}

const onEdgeContextMenu = ({ event, edge }) => {
  hideContextMenu()
  menu.visible = true
  menu.x = event.clientX
  menu.y = event.clientY
  menu.items = [
    {
      key: 'delete-edge',
      label: '删除连线',
      action: () => {
        store.deleteEdge(edge.id)
        hideContextMenu()
      },
    },
  ]
}

const onEdgeAddNode = (payload) => {
  pendingEdge.value = payload
  pendingCanvasPosition.value = canvasRef.value?.toFlowPosition({ x: payload.x, y: payload.y }) || { x: 300, y: 200 }
  openNodePicker(payload.x, payload.y)
}

const fitView = () => {
  canvasRef.value?.fitViewCanvas()
}

const onExport = () => {
  const content = serializeWorkflow(store)
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${store.workflowName || 'workflow'}.json`
  link.click()
  URL.revokeObjectURL(url)
  console.log('Workflow JSON:\n', content)
  ElMessage.success('已导出工作流 JSON')
}

const onImport = () => {
  fileInputRef.value?.click()
}

const handleFileImport = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    store.importWorkflow(text)
    ElMessage.success('导入成功')
  } catch (error) {
    ElMessage.error(error.message || '导入失败')
  } finally {
    event.target.value = ''
  }
}

const onRun = () => {
  const lines = runWorkflowMock(store.nodes, store.edges)
  ElMessageBox.alert(lines.join('<br/>'), '运行结果（Mock）', {
    dangerouslyUseHTMLString: true,
  })
}
</script>
