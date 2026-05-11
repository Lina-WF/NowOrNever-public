<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'
import ThingsFields from '~/components/form/components/thingsFields.vue'
import FormEnd from './components/formEnd.vue'

const props = defineProps<{
  editingPhoto?: string
  editingStatus?: string
  error: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', values: ThingForm): void
}>()

const route = useRoute()
const idParam = computed(() => +(route.params.costumesId as string))

const error = ref(props.error)

const photo = ref<File | null>(null)
const prevPhoto = ref<File | null>(null)
if (props.editingPhoto) {
  const response = await fetch(`/api/file/${props.editingPhoto}`)
  const blob = await response.blob()
  const file = new File([blob], props.editingPhoto, { type: blob.type })
  photo.value = file
  prevPhoto.value = file
}

const status = ref(props.editingStatus || '')
const previewUrl = computed(() => {
  if (!photo.value) return ''
  return URL.createObjectURL(photo.value)
})

async function onSubmit(event: SubmitEventPromise) {
  const { valid } = await event
  if (!valid) {
    return
  }
  else {
    emit('submit', { photo: photo.value!, prevPhoto: prevPhoto.value, status: status.value })
  }
}
</script>

<template>
  <v-form
    fast-fail
    @submit.prevent="onSubmit"
  >
    <v-row
      class="justify-center align-center"
    >
      <v-col
        cols="12"
        sm="6"
        md="5"
      >
        <v-sheet
          class="pa-2 bg-transparent"
        >
          <fieldset
            style="min-width: 0; width: 100%; min-height: 100%; text-align: left;"
            class="outlined-fieldset"
          >
            <legend class="d-flex align-center ml-3 px-5">
              Превью
            </legend>
            <v-img
              height="200px"
              width="200"
              :src="previewUrl"
              cover
              class="ma-auto my-3"
            />
          </fieldset>
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
          <ThingsFields
            :photo="photo"
            :status="status"
            @correct-photo="photo = $event"
            @correct-status="status = $event"
          />
        </v-sheet>
      </v-col>
    </v-row>
    <FormEnd
      :error="error"
      :back-link="`/costumes/${idParam}`"
    />
  </v-form>
</template>

<style scoped>
</style>
