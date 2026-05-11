<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'
import { groupRules, songTitleRules, linkRules } from '~/composables/formRules'
import MembersFields from './components/membersFields.vue'
import FormEnd from './components/formEnd.vue'

const props = defineProps<{
  title?: string
  group?: string
  link?: string
  part?: string
  members?: { userId: string, part: string }[]
  error: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', values: ProjectForm): void
}>()

const route = useRoute()
const idParam = computed(() => +(route.params.projectId as string))

const title = ref(props.title || '')
const group = ref(props.group || '')
const link = ref(props.link || '')
const part = ref(props.part || '')
const members = ref<{ userId: string, part: string }[]>(props.members || [])

const error = ref(props.error)

async function onSubmit(event: SubmitEventPromise) {
  const { valid } = await event
  if (!valid) {
    return
  }
  else {
    emit('submit', { title: title.value, group: group.value, link: link.value, part: part.value, members: members.value })
  }
}
</script>

<template>
  <v-form
    fast-fail
    @submit.prevent="onSubmit"
  >
    <div class="d-flex ga-4">
      <v-text-field
        v-model="group"
        :rules="groupRules"
        label="Группа"
        variant="outlined"
        class="text-darktext"
        append-inner-icon="mdi-account-group-outline"
      />
      —
      <v-text-field
        v-model="title"
        :rules="songTitleRules"
        label="Название песни"
        variant="outlined"
        class="text-darktext"
        append-inner-icon="mdi-music-note-outline"
      />
    </div>
    <v-text-field
      v-model="link"
      :rules="linkRules"
      label="Ссылка на видео"
      variant="outlined"
      class="text-darktext"
      append-inner-icon="mdi-play-circle-outline"
    />
    <MembersFields
      :part="part"
      :members="members"
      @correct="part = $event.part, members = $event.members"
    />
    <FormEnd
      :error="error"
      :back-link="idParam ? `/project/${idParam}` : '/'"
    />
  </v-form>
</template>

<style scoped>
</style>
