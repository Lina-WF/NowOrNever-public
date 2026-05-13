<script setup lang="ts">
import { ref } from 'vue'
import EventModal from '~/components/modals/eventModal.vue'
import AdminDayModal from '~/components/modals/adminDayModal.vue'
import CalendarHeader from '~/components/calendarHeader.vue'
import RouteBtn from '~/components/btns/routeBtn.vue'
import AdminTimeModal from '~/components/modals/adminTimeModal.vue'

definePageMeta({
  middleware: 'member-check',
})

const route = useRoute()
const idParam = computed(() => +(route.params.eventsId as string))

const projectsStore = useProjectsStore()
const usersStore = useUsersStore()
const socketStore = useSocketStore()
const eventsStore = useEventsStore()

const proj = ref(await projectsStore.findProject(idParam.value))
const events = ref(await eventsStore.findEvents(idParam.value))
const calendar = ref()

const focus = ref('')
const focusTime = ref('')
const type = ref<'month' | 'week' | 'day'>('month')
const selectedEventId = ref<number>(0)
const selectedEvent = computed(() => events.value.length ? events.value.find((e: CalendarProjEvent) => +e!.id! === +selectedEventId.value) : undefined)
const selectedElement = ref<HTMLElement>()
const selectedAdminDay = ref<HTMLElement>()
const selectedAdminTime = ref<HTMLElement>()
const selectedOpen = ref(false)
const adminOpenDay = ref(false)
const adminOpenTime = ref(false)

function viewDay(nativeEvent: Event, { date }: { date: string | Date }) {
  focus.value = date as string
  type.value = 'day'
}

function viewDayAdmin({ date }: { date: string | Date }) {
  focus.value = date as string
  type.value = 'day'
}

function clickDay(nativeEvent: Event, { date }: { date: string | Date }) {
  if (usersStore.user?.role === 'admin') {
    focus.value = date as string
    const open = () => {
      selectedAdminDay.value = nativeEvent.target as HTMLElement
      requestAnimationFrame(() => requestAnimationFrame(() => adminOpenDay.value = true))
    }
    if (adminOpenDay.value) {
      adminOpenDay.value = false
      requestAnimationFrame(() => requestAnimationFrame(() => open()))
    }
    else {
      open()
    }
    nativeEvent.stopPropagation()
  }
  else {
    viewDay(nativeEvent, { date })
  }
}

function clickTime(nativeEvent: Event, time: CalendarTimeSlot) {
  if (usersStore.user?.role === 'admin') {
    focus.value = time.date
    focusTime.value = time.time
    const open = () => {
      selectedAdminTime.value = nativeEvent.target as HTMLElement
      requestAnimationFrame(() => requestAnimationFrame(() => adminOpenTime.value = true))
    }
    if (adminOpenTime.value) {
      adminOpenTime.value = false
      requestAnimationFrame(() => requestAnimationFrame(() => open()))
    }
    else {
      open()
    }
    nativeEvent.stopPropagation()
  }
  else {
    return
  }
}

function showEvent(nativeEvent: Event, { event }: { event: CalendarProjEvent }) {
  const open = () => {
    selectedEventId.value = +event!.id!
    selectedElement.value = nativeEvent.target as HTMLElement
    requestAnimationFrame(() => requestAnimationFrame(() => selectedOpen.value = true))
  }
  if (selectedOpen.value) {
    selectedOpen.value = false
    requestAnimationFrame(() => requestAnimationFrame(() => open()))
  }
  else {
    open()
  }
  nativeEvent.stopPropagation()
}

onMounted(() => {
  const unsubscribeEvents = socketStore.onUpdateEvents(async (eventsId) => {
    if (eventsId === idParam.value) {
      events.value = await eventsStore.findEvents(idParam.value)
    }
  })
  const unsubscribeProject = socketStore.onUpdateProject(async (projectId) => {
    if (projectId === idParam.value) {
      proj.value = await projectsStore.findProject(idParam.value)
      if (!proj.value) {
        navigateTo({
          path: '/error',
          state: { reason: 'Проект не найден', code: 404 },
        }, { replace: true })
      }
      const membersStore = useMembersStore()
      const members = await membersStore.findMembers(idParam.value)
      if (members.filter(m => +m.id === +usersStore.user!.id).length !== 1) {
        navigateTo({
          path: '/error',
          state: { reason: 'Вы не участник проекта', code: 403 },
        })
      }
    }
  })

  onUnmounted(() => {
    unsubscribeEvents()
    unsubscribeProject()
  })
})
</script>

<template>
  <div
    style="text-align: center;"
  >
    <v-skeleton-loader
      :loading="!proj"
      type="image"
      height="10vh"
      width="50vw"
      class="bg-transparent long-skeleton mx-auto"
    >
      <div class="title">
        {{ proj.dance.group }} — {{ proj.dance.title }}
      </div>
    </v-skeleton-loader>
    <div
      class="full-calendar"
    >
      <CalendarHeader
        :calendar="calendar"
        :type="type"
        @set-today="focus = ''"
        @prev="calendar.prev()"
        @next="calendar.next()"
        @type="type = $event"
      />
      <v-sheet
        height="400"
        class="bg-transparent"
      >
        <v-skeleton-loader
          :loading="!(events && usersStore.user)"
          type="image"
          height="400"
          class="bg-transparent long-skeleton mx-auto"
        >
          <v-calendar
            ref="calendar"
            v-model="focus"
            :events="events"
            :type="type"
            event-name="title"
            :class="(usersStore.user?.role === 'admin' ? 'cursor-pointer ' : '') + 'bg-themewhite rounded-b-lg rounded-calendar'"
            @click:time="clickTime"
            @click:day="clickDay"
            @click:event="showEvent"
            @click:more="viewDay"
          >
            <template #event="{ eventParsed }">
              <div>
                {{ eventParsed.start.time }} — {{ eventParsed.input.title }}
              </div>
            </template>
          </v-calendar>
        </v-skeleton-loader>
        <EventModal
          v-model="selectedOpen"
          :activator="selectedElement"
          :selected-event="selectedEvent"
          @close="selectedOpen = false"
        />
        <AdminDayModal
          v-model="adminOpenDay"
          :activator="selectedAdminDay"
          :focus="focus"
          @close="adminOpenDay = false"
          @go="viewDayAdmin({ date: focus }); adminOpenDay = false;"
        />
        <AdminTimeModal
          v-model="adminOpenTime"
          :activator="selectedAdminTime"
          :focus="focus"
          :focus-time="focusTime"
          @close="adminOpenTime = false"
        />
      </v-sheet>
    </div>
    <RouteBtn
      :link="`/project/${idParam}`"
      :text="'Назад'"
    />
  </div>
</template>

<style scoped>
:deep(.v-outside) {
  background-color: rgb(var(--v-theme-primary));
}

.rounded-calendar {
  overflow: hidden;
}

.full-calendar {
  border-left: 2px solid rgb(var(--v-theme-permanentDark));
  border-right: 2px solid rgb(var(--v-theme-permanentDark));
  border-radius: 10px;
  border-bottom: 2px solid rgb(var(--v-theme-permanentDark));
  background-color: rgb(var(--v-theme-permanentDark));
}
</style>
