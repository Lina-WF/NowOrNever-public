<script setup lang="ts">
import { eventTitleRules } from '~/composables/formRules'
import type { SubmitEventPromise } from 'vuetify'
import DateTimeFields from '~/components/form/components/dateTimeFields.vue'
import ColorPicker from './components/colorPicker.vue'
import FormEnd from './components/formEnd.vue'

const props = defineProps<{
  title?: string
  dateTime?: { dateStart: string, timeStart: string, dateEnd: string, timeEnd: string }
  color?: string
  address?: string
  price?: number
  comment?: string
  error: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', values: EventForm): void
}>()

const route = useRoute()
const dateTimeParams = computed(() => typeof props.dateTime === 'object' ? '' : (route.params.eventDateTime as string).split('_'))
const idParam = computed(() => +(route.params.eventsId as string))
const error = ref(props.error)

const title = ref(props.title || '')
const dateTime = reactive(props.dateTime || {
  dateStart: ISOFormat(dateTimeParams.value[0]!),
  timeStart: dateTimeParams.value.length >= 2 ? TimeFormat(dateTimeParams.value[1]!) : '',
  dateEnd: '',
  timeEnd: '',
})
const color = ref(props.color || '')
const address = ref(props.address || '')
const price = ref(props.price || 0)
const comment = ref(props.comment || '')

async function onSubmit(event: SubmitEventPromise) {
  const { valid } = await event
  if (!valid) {
    return
  }
  else {
    emit('submit', { title: title.value, dateTime: dateTime, color: color.value, address: address.value, price: price.value, comment: comment.value })
  }
}
</script>

<template>
  <v-form
    fast-fail
    @submit.prevent="onSubmit"
  >
    <v-text-field
      v-model="title"
      :rules="eventTitleRules"
      label="Название"
      variant="outlined"
      class="text-darktext"
    />
    <DateTimeFields
      :date-time="dateTime"
      @correct="Object.assign(dateTime, $event)"
    />
    <ColorPicker
      :color="color"
      @correct="color = $event"
    />
    <v-text-field
      v-model="address"
      label="Адрес"
      variant="outlined"
      class="text-darktext"
      append-inner-icon="mdi-map-marker-outline"
    />
    <v-text-field
      v-model="price"
      label="Цена с человека"
      variant="outlined"
      class="text-darktext"
      type="number"
      append-inner-icon="mdi-currency-rub"
    />
    <v-textarea
      v-model="comment"
      label="Комментарий"
      variant="outlined"
      class="text-darktext"
      type="number"
    />
    <FormEnd
      :error="error"
      :back-link="`/events/${idParam}`"
    />
  </v-form>
</template>

<style scoped>
</style>
