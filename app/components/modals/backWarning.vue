<script setup lang="ts">
defineEmits<{
  (e: 'no' | 'yes'): void
}>()
</script>

<template>
  <v-dialog
    width="auto"
  >
    <v-card
      max-width="400"
      prepend-icon="mdi-alert-outline"
      text="Вы действительно хотите выйти? Внесённые изменения не сохранятся."
      title="Выход"
      class="bg-themewhite"
    >
      <template #actions>
        <v-btn
          color="secondary"
          text="Нет"
          @click="$emit('no')"
        />
        <v-btn
          color="secondary"
          text="Да"
          @click="$emit('yes')"
        />
      </template>
    </v-card>
  </v-dialog>
</template>

<style scope>
</style>
