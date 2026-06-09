# workflow-editor

一个基于 **Vue 3 + JavaScript + Vue Flow + Element Plus + Pinia** 的可视化工作流编辑器，参考了 Dify 项目 `web/app/components/workflow` 的核心交互理念，并使用 Vue 技术栈进行了等价实现。

## 技术栈

- Vue 3（Composition API + `<script setup>`）
- JavaScript（无 TypeScript）
- Vite
- Vue Flow：`@vue-flow/core`、`@vue-flow/background`、`@vue-flow/controls`、`@vue-flow/minimap`
- Element Plus + `@element-plus/icons-vue`
- Pinia

## 目录结构

```text
workflow-editor/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── components/
│   │   └── workflow/
│   │       ├── WorkflowEditor.vue
│   │       ├── WorkflowCanvas.vue
│   │       ├── Header.vue
│   │       ├── NodePanel.vue
│   │       ├── ConfigPanel.vue
│   │       ├── ContextMenu.vue
│   │       ├── nodes/
│   │       │   ├── BaseNode.vue
│   │       │   ├── StartNode.vue
│   │       │   ├── EndNode.vue
│   │       │   ├── LLMNode.vue
│   │       │   ├── KnowledgeNode.vue
│   │       │   ├── IfElseNode.vue
│   │       │   ├── CodeNode.vue
│   │       │   ├── HttpNode.vue
│   │       │   └── NoteNode.vue
│   │       ├── edges/
│   │       │   └── CustomEdge.vue
│   │       ├── constants.js
│   │       └── utils.js
│   ├── stores/
│   │   └── workflow.js
│   └── styles/
│       └── index.css
```

## 安装与运行

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
```

## 已实现功能

- 工作流画布：节点拖拽、连线、缩放、平移
- Background 网格、Controls、MiniMap
- 自定义节点（Start / End / LLM / Knowledge / IfElse / Code / HTTP / Note）
- 自定义连线（连线中「+」插入节点、删除连线）
- 节点选择器（左侧固定面板 + 浮动添加面板）
- 右侧配置面板（Element Plus 表单实时编辑）
- 顶部工具栏（重命名、导入、导出、撤销、重做、运行 mock、Fit View）
- 右键菜单（画布、节点、连线）
- Pinia 历史记录（撤销/重做）
- DSL 导入/导出 JSON
- 默认示例工作流（Start → LLM → End）

## 与 Dify 工作流编辑器对应关系

- Dify `index.tsx` → `WorkflowCanvas.vue`（画布主交互）
- Dify `block-selector` → `NodePanel.vue`（节点添加面板）
- Dify `nodes/*` → `nodes/*.vue`（自定义节点）
- Dify `custom-edge` / `custom-connection-line` → `edges/CustomEdge.vue`（自定义边动作）
- Dify `panel/*` → `ConfigPanel.vue`（节点配置编辑）
- Dify `*contextmenu*` → `ContextMenu.vue + WorkflowEditor.vue`（右键菜单行为）
- Dify `header` / `operator` → `Header.vue + WorkflowCanvas.vue`（工具栏与视图控制）
- Dify `workflow-history-store.ts` → `src/stores/workflow.js`（历史记录撤销/重做）

