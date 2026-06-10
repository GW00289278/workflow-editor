<template>
  <aside class="config-panel">
    <template v-if="node">
      <div class="config-panel-title">节点配置</div>
      <el-form label-position="top" size="small">
        <el-form-item label="标题">
          <el-input :model-value="node.data?.title" @update:model-value="(value) => $emit('rename', value)" />
        </el-form-item>

        <template v-if="node.type === NODE_TYPES.LLM">
          <el-form-item label="模型">
            <el-input :model-value="node.data?.config?.model" @update:model-value="(value) => updateConfig({ model: value })" />
          </el-form-item>
          <el-form-item label="温度">
            <el-slider :model-value="node.data?.config?.temperature" :min="0" :max="1" :step="0.1" @update:model-value="(value) => updateConfig({ temperature: value })" />
          </el-form-item>
          <el-form-item label="Prompt">
            <el-input type="textarea" :rows="4" :model-value="node.data?.config?.prompt" @update:model-value="(value) => updateConfig({ prompt: value })" />
          </el-form-item>
        </template>

        <template v-else-if="node.type === NODE_TYPES.KNOWLEDGE">
          <el-form-item label="数据集名称">
            <el-input :model-value="node.data?.config?.dataset" @update:model-value="(value) => updateConfig({ dataset: value })" />
          </el-form-item>
          <el-form-item label="Top K">
            <el-input-number :model-value="node.data?.config?.topK" :min="1" :max="20" @update:model-value="(value) => updateConfig({ topK: value })" />
          </el-form-item>
        </template>

        <template v-else-if="node.type === NODE_TYPES.IF_ELSE">
          <el-form-item label="条件表达式">
            <el-input type="textarea" :rows="3" :model-value="node.data?.config?.condition" @update:model-value="(value) => updateConfig({ condition: value })" />
          </el-form-item>
        </template>

        <template v-else-if="node.type === NODE_TYPES.CODE">
          <el-form-item label="语言">
            <el-select :model-value="node.data?.config?.language" @update:model-value="(value) => updateConfig({ language: value })">
              <el-option label="JavaScript" value="javascript" />
              <el-option label="Python" value="python" />
              <el-option label="Shell" value="shell" />
            </el-select>
          </el-form-item>
          <el-form-item label="代码">
            <el-input type="textarea" :rows="6" :model-value="node.data?.config?.code" @update:model-value="(value) => updateConfig({ code: value })" />
          </el-form-item>
        </template>

        <template v-else-if="node.type === NODE_TYPES.HTTP">
          <el-form-item label="URL">
            <el-input :model-value="node.data?.config?.url" @update:model-value="(value) => updateConfig({ url: value })" />
          </el-form-item>
          <el-form-item label="Method">
            <el-select :model-value="node.data?.config?.method" @update:model-value="(value) => updateConfig({ method: value })">
              <el-option label="GET" value="GET" />
              <el-option label="POST" value="POST" />
              <el-option label="PUT" value="PUT" />
              <el-option label="DELETE" value="DELETE" />
            </el-select>
          </el-form-item>
          <el-form-item label="Headers(JSON)">
            <el-input type="textarea" :rows="3" :model-value="node.data?.config?.headers" @update:model-value="(value) => updateConfig({ headers: value })" />
          </el-form-item>
        </template>

        <template v-else-if="node.type === NODE_TYPES.NOTE">
          <el-form-item label="备注内容">
            <el-input type="textarea" :rows="5" :model-value="node.data?.config?.content" @update:model-value="(value) => updateConfig({ content: value })" />
          </el-form-item>
        </template>
      </el-form>

      <el-button type="danger" plain @click="$emit('delete')">删除节点</el-button>
    </template>
    <template v-else>
      <div class="config-panel-empty">请选择一个节点后编辑配置</div>
    </template>
  </aside>
</template>

<script setup>
import { NODE_TYPES } from './constants'

const props = defineProps({
  node: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update-config', 'rename', 'delete'])

const updateConfig = (patch) => {
  emit('update-config', patch)
}
</script>
