<template>
  <BaseNode :type="type" :data="data" :selected="selected">
    <small>{{ data?.config?.method || 'GET' }} {{ data?.config?.url || '' }}</small>
  </BaseNode>
</template>

<script setup>
import BaseNode from './BaseNode.vue'
defineProps({ type: String, data: Object, selected: Boolean })
</script>
