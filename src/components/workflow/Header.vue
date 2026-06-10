<template>
  <header class="workflow-header">
    <div class="header-left">
      <el-input
        :model-value="workflowName"
        class="workflow-name-input"
        placeholder="请输入工作流名称"
        @update:model-value="$emit('update-name', $event)"
      />
    </div>
    <div class="header-actions">
      <el-button @click="$emit('import')">导入</el-button>
      <el-button @click="$emit('export')">保存/导出</el-button>
      <el-button @click="$emit('undo')" :disabled="!canUndo">撤销</el-button>
      <el-button @click="$emit('redo')" :disabled="!canRedo">重做</el-button>
      <el-button @click="$emit('fit-view')">Fit View</el-button>
      <el-button type="primary" @click="$emit('run')">运行</el-button>
    </div>
    <div class="header-right">缩放：{{ zoomPercent }}%</div>
  </header>
</template>

<script setup>
defineProps({
  workflowName: {
    type: String,
    default: '',
  },
  canUndo: Boolean,
  canRedo: Boolean,
  zoomPercent: {
    type: Number,
    default: 100,
  },
})

defineEmits(['update-name', 'import', 'export', 'undo', 'redo', 'fit-view', 'run'])
</script>
