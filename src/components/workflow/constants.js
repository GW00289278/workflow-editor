import {
  VideoPlay,
  CircleCheck,
  MagicStick,
  Collection,
  Switch,
  Cpu,
  Link,
  EditPen,
} from '@element-plus/icons-vue'

export const NODE_TYPES = {
  START: 'start',
  END: 'end',
  LLM: 'llm',
  KNOWLEDGE: 'knowledge',
  IF_ELSE: 'ifElse',
  CODE: 'code',
  HTTP: 'http',
  NOTE: 'note',
}

export const NODE_DEFINITIONS = {
  [NODE_TYPES.START]: {
    label: 'Start',
    color: '#16a34a',
    icon: VideoPlay,
    defaultConfig: { input: '开始执行' },
  },
  [NODE_TYPES.END]: {
    label: 'End',
    color: '#ef4444',
    icon: CircleCheck,
    defaultConfig: { output: '结束执行' },
  },
  [NODE_TYPES.LLM]: {
    label: 'LLM',
    color: '#6366f1',
    icon: MagicStick,
    defaultConfig: { model: 'gpt-4o-mini', temperature: 0.7, prompt: '请根据输入生成回答' },
  },
  [NODE_TYPES.KNOWLEDGE]: {
    label: 'Knowledge Retrieval',
    color: '#0ea5e9',
    icon: Collection,
    defaultConfig: { dataset: 'default-knowledge', topK: 3 },
  },
  [NODE_TYPES.IF_ELSE]: {
    label: 'If / Else',
    color: '#f59e0b',
    icon: Switch,
    defaultConfig: { condition: 'score > 0.5' },
  },
  [NODE_TYPES.CODE]: {
    label: 'Code',
    color: '#7c3aed',
    icon: Cpu,
    defaultConfig: { language: 'javascript', code: 'return input' },
  },
  [NODE_TYPES.HTTP]: {
    label: 'HTTP Request',
    color: '#0284c7',
    icon: Link,
    defaultConfig: { url: 'https://api.example.com', method: 'GET', headers: '{}' },
  },
  [NODE_TYPES.NOTE]: {
    label: 'Note',
    color: '#f97316',
    icon: EditPen,
    defaultConfig: { content: '备注信息' },
  },
}

export const WORKFLOW_DEFAULT_NAME = '新建工作流'
