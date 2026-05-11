<script setup lang="ts">
import DeleteWarning from '../modals/deleteWarning.vue'

defineProps<{
  things: { id: number, subtitle: string, link: string }[]
  isUser: boolean
}>()

defineEmits<{
  (e: 'del', thingId: number): void
}>()

const route = useRoute()
const paramId = computed(() => +(route.params.costumesId as string))

const dialog = ref(false)
const delId = ref(0)
</script>

<template>
  <v-slide-group
    show-arrows
    class="pa-md-4"
  >
    <v-slide-group-item
      v-for="thing in things"
      :key="thing.id"
    >
      <v-card
        class="bg-primary ma-2"
        width="200"
        elevation="0"
        color="themewhite"
      >
        <v-img
          height="200px"
          :src="`/api/file/${thing.link}`"
          cover
        >
          <div class="d-flex justify-end">
            <v-menu
              v-if="isUser"
              location="bottom end"
              transition="fade-transition"
            >
              <template #activator="{ props }">
                <v-btn
                  icon="mdi-dots-vertical"
                  color="rgba(255,255,255,0.7)"
                  class="d-flex align-center justify-center ma-2"
                  size="25"
                  elevation="0"
                  v-bind="props"
                >
                  <v-icon
                    icon="mdi-dots-vertical-circle-outline"
                    size="20"
                    color="permanentDark"
                  />
                </v-btn>
              </template>

              <v-list
                class="bg-themewhite"
              >
                <v-list-item
                  prepend-icon="mdi-pencil-outline"
                  title="Редактировать"
                  @click="navigateTo(`/costumes/${paramId}/editThing/${thing.id}`)"
                >
                  <template #prepend>
                    <v-icon
                      class="gradient-icon mb-1"
                    />
                  </template>
                </v-list-item>

                <v-list-item
                  prepend-icon="mdi-delete-outline"
                  title="Удалить"
                  color="error"
                  @click="dialog = true; delId = thing.id"
                >
                  <template #prepend>
                    <v-icon
                      class="gradient-icon mb-1"
                    />
                  </template>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </v-img>
        <v-card-subtitle class="d-flex py-2 justify-center align-center">
          <div><strong>{{ thing.subtitle }}</strong></div>
        </v-card-subtitle>
      </v-card>
    </v-slide-group-item>
    <DeleteWarning
      v-model="dialog"
      :element="'thing'"
      @no="dialog = false; delId = 0"
      @yes="$emit('del', delId); dialog = false"
    />
  </v-slide-group>
</template>

<style scoped>
</style>
