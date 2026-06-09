import { NODE_DEFINITIONS, NODE_TYPES, WORKFLOW_DEFAULT_NAME } from './constants'

let idSeed = 0

export function createId(prefix = 'node') {
  idSeed += 1
  return `${prefix}_${Date.now()}_${idSeed}`
}

export function createNode(type, position = { x: 160, y: 160 }) {
  const definition = NODE_DEFINITIONS[type]
  return {
    id: createId(type),
    type,
    position,
    data: {
      title: definition?.label || 'Node',
      config: JSON.parse(JSON.stringify(definition?.defaultConfig || {})),
    },
  }
}

export function createEdge(connection) {
  return {
    id: createId('edge'),
    type: 'custom',
    source: connection.source,
    sourceHandle: connection.sourceHandle ?? null,
    target: connection.target,
    targetHandle: connection.targetHandle ?? null,
    animated: false,
  }
}

export function createDefaultWorkflow() {
  const startNode = createNode(NODE_TYPES.START, { x: 120, y: 220 })
  const llmNode = createNode(NODE_TYPES.LLM, { x: 420, y: 220 })
  const endNode = createNode(NODE_TYPES.END, { x: 720, y: 220 })
  return {
    workflowName: WORKFLOW_DEFAULT_NAME,
    nodes: [startNode, llmNode, endNode],
    edges: [
      createEdge({ source: startNode.id, target: llmNode.id }),
      createEdge({ source: llmNode.id, target: endNode.id }),
    ],
  }
}

export function serializeWorkflow(state) {
  return JSON.stringify(
    {
      workflowName: state.workflowName,
      nodes: state.nodes,
      edges: state.edges,
      exportedAt: new Date().toISOString(),
    },
    null,
    2,
  )
}

export function parseWorkflow(jsonText) {
  const parsed = JSON.parse(jsonText)
  if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
    throw new Error('导入失败：JSON 格式不合法，缺少 nodes 或 edges。')
  }
  return {
    workflowName: parsed.workflowName || WORKFLOW_DEFAULT_NAME,
    nodes: parsed.nodes,
    edges: parsed.edges,
  }
}

export function runWorkflowMock(nodes, edges) {
  const sorted = [...nodes].sort((a, b) => a.position.x - b.position.x || a.position.y - b.position.y)
  return sorted.map((node) => {
    const inputCount = edges.filter((edge) => edge.target === node.id).length
    const outputCount = edges.filter((edge) => edge.source === node.id).length
    return `${node.data?.title || node.type}: in(${inputCount}) -> out(${outputCount})`
  })
}

export function autoLayout(nodes) {
  return nodes.map((node, index) => ({
    ...node,
    position: {
      x: 120 + (index % 3) * 300,
      y: 120 + Math.floor(index / 3) * 180,
    },
  }))
}
