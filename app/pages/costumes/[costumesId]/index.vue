<script setup lang="ts">
import RouteBtn from '~/components/btns/routeBtn.vue'
import ListOfImgs from '~/components/lists/listOfImgs.vue'
import ListOfText from '~/components/lists/listOfText.vue'

definePageMeta({
  middleware: 'member-check',
})

const route = useRoute()
const idParam = computed(() => +(route.params.costumesId as string))

const membersStore = useMembersStore()
const costumesStore = useCostumesStore()
const usersStore = useUsersStore()
const socketStore = useSocketStore()
const projectsStore = useProjectsStore()

const proj = ref(await projectsStore.findProject(idParam.value))

const members = ref(await membersStore.findMembers(idParam.value))
const costumes = ref<UserCostume[]>(await costumesStore.findCostumes(idParam.value))
const sortedMembers = computed(() => members.value.length ? membersStore.sortMembers(members.value, usersStore.user) : [])

onMounted(() => {
  const unsubscribeCostumes = socketStore.onUpdateCostumes(async (costumesId) => {
    if (costumesId === idParam.value) {
      costumes.value = await costumesStore.findCostumes(idParam.value)
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
      members.value = await membersStore.findMembers(idParam.value)
      if (members.value.filter(m => +m.id === +usersStore.user!.id).length !== 1) {
        navigateTo({
          path: '/error',
          state: { reason: 'Вы не участник проекта', code: 403 },
        })
      }
    }
  })

  onUnmounted(() => {
    unsubscribeCostumes()
    unsubscribeProject()
  })
})
</script>

<template>
  <div style="text-align: center;">
    <v-skeleton-loader
      :loading="!proj"
      type="image"
      height="10vh"
      width="400"
      class="bg-transparent long-skeleton mx-auto"
    >
      <div class="title">
        {{ proj.dance.group }} — {{ proj.dance.title }}
      </div>
    </v-skeleton-loader>
    <v-skeleton-loader
      :loading="!(members && usersStore.user && costumes)"
      type="image"
      height="40vh"
      class="bg-transparent long-skeleton mx-auto"
    >
      <div
        v-for="member in sortedMembers"
        :key="member!.id"
        class="ma-0 ga-0 ga-md-5 d-flex flex-column"
      >
        <div
          style="min-width: 0; width: 100%;"
        >
          <fieldset
            style="min-width: 0; width: 100%; text-align: left;"
            class="outlined-fieldset"
          >
            <legend class="d-flex align-center ml-7 pr-5">
              <ListOfText
                class="pa-0"
                :things="[{ id: 1, title: member!.name, subtitle: member!.part }]"
              />
              <RouteBtn
                v-if="usersStore.user!.id === member!.id"
                :text="'Добавить вещь'"
                :link="`/costumes/${idParam}/newThing`"
                prepend-icon="mdi-plus"
                width="150"
                class="mb-4 animate__animated animate__headShake"
              />
            </legend>

            <ListOfImgs
              v-if="costumes.find(costume => member!.id === costume.userId)"
              class="mb-7 mx-7"
              :is-user="usersStore.user!.id === member!.id"
              :things="costumes.find(costume => member!.id === costume.userId)!.things.map((thing: Thing) => { return { id: thing.id, subtitle: thing.status, link: thing.link } })"
              @del="costumesStore.delThing(idParam, member!.id, $event)"
            />
          </fieldset>
        </div>
      </div>
    </v-skeleton-loader>
    <RouteBtn
      :link="`/project/${idParam}`"
      :text="'Назад'"
    />
  </div>
</template>

<style scoped>
</style>
