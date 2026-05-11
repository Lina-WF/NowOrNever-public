<script setup lang="ts">
defineProps<{
  link: string
  text: string
}>()
</script>

<template>
  <v-btn
    color="secondary"
    elevation="0"
    :to="link"
    width="30vw"
    class="my-2 mt-4"
    variant="outlined"
    prepend-icon="mdi-chevron-left"
  >
    {{ text }}
  </v-btn>
</template>

<style scoped>
</style>
