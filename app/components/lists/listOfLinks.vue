<script setup lang="ts">
defineProps<{
  things: { id: number, title: string, subtitle?: string, icon?: string, link?: string, href?: string }[]
  color?: string
  role?: 'prev' | 'next'
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
      width="100%"
      class="my-2"
    >
      <v-card
        class="mx-auto"
        width="100%"
        :subtitle="thing.subtitle"
        :title="thing.title"
        :to="thing.link ? thing.link : undefined"
        :href="thing.href ? thing.href : undefined"
        :target="thing.href ? '_blank' : undefined"
        :rel="thing.href ? 'noopener noreferrer' : undefined"
        variant="outlined"
        :color="(color ? color : 'darktext')"
        :append-icon="role === 'next' ? 'mdi-chevron-right' : ''"
        :prepend-icon="role === 'prev' ? 'mdi-chevron-left' : (thing.icon ? thing.icon : '')"
      >
        <template #prepend>
          <v-icon
            class="gradient-icon mr-4 mb-2"
            size="30"
          />
        </template>
        <template #append>
          <v-icon class="gradient-icon" />
        </template>
      </v-card>
    </v-list-item>
  </v-list>
</template>

<style scoped>
</style>
