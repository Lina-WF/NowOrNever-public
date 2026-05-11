<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <v-btn
    color="secondary"
    elevation="0"
    width="30vw"
    class="mt-2"
    type="submit"
  >
    {{ text }}
  </v-btn>
</template>

<style scoped>
</style>
