<script setup lang="ts">
import { z } from 'zod'
import { VTextField } from 'vuetify/components'

const props = defineProps<{
  dateTime: { dateStart: string, timeStart: string, dateEnd: string, timeEnd: string }
}>()

const emit = defineEmits<{
  (e: 'correct', values: { dateStart: string, timeStart: string, dateEnd: string, timeEnd: string }): void
}>()

const menu = reactive({
  dateStart: false,
  timeStart: false,
  dateEnd: false,
  timeEnd: false,
})

const form = reactive(props.dateTime)
const dateStartFormat = computed(() => form.dateStart ? (new Date(form.dateStart)).toLocaleDateString() : '')
const dateEndFormat = computed(() => form.dateEnd ? (new Date(form.dateEnd)).toLocaleDateString() : '')

const dateStartRef = ref<VTextField>()
const timeStartRef = ref<VTextField>()
const dateEndRef = ref<VTextField>()
const timeEndRef = ref<VTextField>()

watch(form, () => {
  if (Object.values(form).every(value => !!value)) {
    dateEndRef.value?.validate()
    timeEndRef.value?.validate()
  }
})
watch(() => menu.dateStart, () => {
  if (!menu.dateStart) dateStartRef.value?.validate()
})
watch(() => menu.timeStart, () => {
  if (!menu.timeStart) timeStartRef.value?.validate()
})
watch(() => menu.dateEnd, () => {
  if (!menu.dateEnd) dateEndRef.value?.validate()
})
watch(() => menu.timeEnd, () => {
  if (!menu.timeEnd) timeEndRef.value?.validate()
})

const dateTimeSchema = z.object({
  dateStart: z.string().min(1, 'Выберите дату начала'),
  dateEnd: z.string().min(1, 'Выберите дату окончания'),
  timeStart: z.string().min(1, 'Выберите время начала'),
  timeEnd: z.string().min(1, 'Выберите время окончания'),
}).superRefine((data, ctx) => {
  if (Object.values(form).some(value => value === '')) return true

  const start = new Date(`${data.dateStart}T${data.timeStart}`)
  const end = new Date(`${data.dateEnd}T${data.timeEnd}`)

  if (data.dateEnd < data.dateStart) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Дата окончания не может быть раньше даты начала',
      path: ['dateEnd'],
    })
  }
  else if (data.dateEnd === data.dateStart && end <= start) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Время окончания должно быть позже времени начала',
      path: ['timeEnd'],
    })
  }
  else emit('correct', { dateStart: data.dateStart, timeStart: data.timeStart, dateEnd: data.dateEnd, timeEnd: data.timeEnd })
})

const dateTimeRules = (path: string | Date) => {
  const result = dateTimeSchema.safeParse(
    { dateStart: ISOFormat(form.dateStart),
      dateEnd: ISOFormat(form.dateEnd),
      timeStart: form.timeStart,
      timeEnd: form.timeEnd },
  )
  if (result.success) return true

  const error = result.error.issues.find(issue => issue.path[0] === path)
  return error ? error.message : true
}
</script>

<template>
  <div class="d-flex ga-4 mb-2 ">
    <v-text-field
      ref="dateStartRef"
      :model-value="dateStartFormat"
      label="Дата начала"
      :rules="[() => dateTimeRules('dateStart')]"
      append-inner-icon="mdi-calendar-range-outline"
      variant="outlined"
      class="text-darktext"
      readonly
    >
      <v-menu
        v-model="menu.dateStart"
        :close-on-content-click="false"
        activator="parent"
        min-width="0"
        transition="fade-transition"
      >
        <v-date-picker
          v-model="form.dateStart"
          class="bg-themewhite"
        />
      </v-menu>
    </v-text-field>
    <v-text-field
      ref="timeStartRef"
      :model-value="form.timeStart"
      label="Время начала"
      :rules="[() => dateTimeRules('timeStart')]"
      append-inner-icon="mdi-clock-time-four-outline"
      variant="outlined"
      class="text-darktext"
      readonly
    >
      <v-menu
        v-model="menu.timeStart"
        :close-on-content-click="false"
        activator="parent"
        min-width="0"
        transition="fade-transition"
      >
        <v-time-picker
          v-model="form.timeStart"
          class="bg-themewhite"
          format="24hr"
        />
      </v-menu>
    </v-text-field>
  </div>
  <div class="d-flex ga-4 mb-2 ">
    <v-text-field
      ref="dateEndRef"
      :model-value="dateEndFormat"
      label="Дата окончания"
      :rules="[() => dateTimeRules('dateEnd')]"
      append-inner-icon="mdi-calendar-range-outline"
      variant="outlined"
      class="text-darktext"
      readonly
    >
      <v-menu
        v-model="menu.dateEnd"
        :close-on-content-click="false"
        activator="parent"
        min-width="0"
        transition="fade-transition"
      >
        <v-date-picker
          v-model="form.dateEnd"
          class="bg-themewhite"
        />
      </v-menu>
    </v-text-field>
    <v-text-field
      ref="timeEndRef"
      :model-value="form.timeEnd"
      label="Время окончания"
      :rules="[() => dateTimeRules('timeEnd')]"
      append-inner-icon="mdi-clock-time-four-outline"
      variant="outlined"
      class="text-darktext"
      readonly
    >
      <v-menu
        v-model="menu.timeEnd"
        :close-on-content-click="false"
        activator="parent"
        min-width="0"
        transition="fade-transition"
      >
        <v-time-picker
          v-model="form.timeEnd"
          class="bg-themewhite"
          format="24hr"
        />
      </v-menu>
    </v-text-field>
  </div>
</template>

<style scoped>
</style>
