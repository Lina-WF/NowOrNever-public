<script setup lang="ts">
defineProps<{
  calendar: HTMLElement
  type: 'month' | 'week' | 'day'
}>()

defineEmits<{
  (e: 'setToday' | 'prev' | 'next'): void
  (e: 'type', newType: 'month' | 'week' | 'day'): void
}>()

const typeToLabel = {
  month: 'Месяц',
  week: 'Неделя',
  day: 'День',
}
</script>

<template>
  <v-sheet
    height="64"
    class="bg-transparent rounded-t-lg rounded-calendar-header"
  >
    <v-toolbar
      flat
      color="headfoot"
      class="pl-2 pr-2 rounded-t-lg "
    >
      <v-btn
        class="me-4 d-none d-sm-block"
        variant="outlined"
        @click="$emit('setToday')"
      >
        Сегодня
      </v-btn>
      <v-btn
        size="small"
        variant="text"
        icon
        @click="$emit('prev')"
      >
        <v-icon size="small">
          mdi-chevron-left
        </v-icon>
      </v-btn>
      <v-skeleton-loader
        :loading="!calendar"
        type="image"
        height="10vh"
        width="50vw"
        class="bg-transparent long-skeleton mx-auto"
      >
        <v-toolbar-title>
          {{ calendar.title }}
        </v-toolbar-title>
      </v-skeleton-loader>
      <v-btn
        size="small"
        variant="text"
        icon
        @click="$emit('next')"
      >
        <v-icon size="small">
          mdi-chevron-right
        </v-icon>
      </v-btn>
      <v-menu
        location="bottom end"
        transition="fade-transition"
      >
        <template #activator="{ props }">
          <v-btn
            variant="outlined"
            v-bind="props"
          >
            <span>{{ typeToLabel[type] }}</span>
            <v-icon end>
              mdi-menu-down
            </v-icon>
          </v-btn>
        </template>
        <v-list class="bg-themewhite">
          <v-list-item
            v-for="typeItem, typeItemKey in typeToLabel"
            :key="typeItemKey"
            @click="$emit('type', typeItemKey)"
          >
            <v-list-item-title>{{ typeItem }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
  </v-sheet>
</template>

<style scoped>
.rounded-calendar-header {
  border-top: 2px solid rgb(var(--v-theme-permanentDark));
}
</style>
