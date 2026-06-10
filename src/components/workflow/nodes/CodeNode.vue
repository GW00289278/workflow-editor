<template>
  <BaseNode :type="type" :data="data" :selected="selected">
    <small>{{ data?.config?.language || 'code' }}</small>
  </BaseNode>
</template>

<script setup>
import BaseNode from './BaseNode.vue'
defineProps({ type: String, data: Object, selected: Boolean })
</script>
