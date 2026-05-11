<script setup lang="ts">
defineProps<{
  things: { id: number, title: string, subtitle?: string, icon?: string }[]
}>()
</script>

<template>
  <v-list
    lines="two"
    class="bg-transparent"
    width="100%"
  >
    <v-list-item
      v-for="thing in things"
      :key="thing.id"
      class="bg-transparent py-md-2 px-0 item-border"
      width="100%"
    >
      <div class="d-flex w-100">
        <v-card
          :subtitle="thing.subtitle"
          :title="thing.title"
          elevation="0"
          :prepend-icon="thing.icon"
          class="bg-transparent"
        >
          <template #prepend>
            <v-icon
              v-if="thing.icon"
              class="gradient-icon mr-4 mb-2"
              size="30"
            />
          </template>
        </v-card>
      </div>
    </v-list-item>
  </v-list>
</template>

<style scoped>
.item-border:not(:last-child) {
 border-bottom-width: 1px;
 border-bottom-color: rgb(var(--v-theme-darktext));
}

:deep(v-card-subtitle) {
  padding: 0 !important;
}
</style>
