<template>
  <BaseNode :type="type" :data="data" :selected="selected">
    <small>{{ data?.config?.content || '备注' }}</small>
  </BaseNode>
</template>

<script setup>
import BaseNode from './BaseNode.vue'
defineProps({ type: String, data: Object, selected: Boolean })
</script>
