<script setup lang="ts">
</script>

<template>
  <v-row
    class="justify-space-around"
  >
    <v-col
      cols="12"
      sm="6"
      md="5"
    >
      <v-sheet
        class="pa-2 bg-transparent"
      >
        <slot name="col1" />
      </v-sheet>
    </v-col>
    <v-col
      cols="12"
      sm="6"
      md="5"
    >
      <v-sheet
        class="pa-2 bg-transparent"
      >
        <slot name="col2" />
      </v-sheet>
    </v-col>
  </v-row>
</template>

<style scoped>
</style>
