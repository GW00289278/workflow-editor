<template>
  <BaseNode :type="type" :data="data" :selected="selected">
    <small>{{ data?.config?.model || '模型未设置' }}</small>
  </BaseNode>
</template>

<script setup>
import BaseNode from './BaseNode.vue'
defineProps({ type: String, data: Object, selected: Boolean })
</script>
