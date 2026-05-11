<script setup lang="ts">
import { memberRules, partRules } from '~/composables/formRules'

const props = defineProps<{
  part: string
  members: { userId: string, part: string }[]
}>()

const emit = defineEmits<{
  (e: 'correct', values: { members: { userId: string, part: string }[], part: string }): void
}>()

const usersStore = useUsersStore()
const part = ref(props.part)

type RawUser = { id: number, name: string, email: string }
const members = ref(props.members)
const rawUsers = await usersStore.getUsers()

function getFormatedUsers(id: string) {
  return rawUsers.filter((user: RawUser) => +user.id !== +usersStore.user!.id && !members.value.some(member => +member.userId === +user.id && +user.id !== +id))
    .map((user: RawUser) => (
      { title: user.name, subtitle: user.email, value: user.id }
    ))
}

function addMember() {
  members.value.push({ userId: '', part: '' })
}

function removeMember(id: number) {
  members.value.splice(id, 1)
}

const valid = computed(() => {
  return partRules.every(rule => rule(part.value) === true)
    && members.value.some(member => memberRules.every(rule => rule(member.userId) === true)
      && partRules.every(rule => rule(member.part) === true),
    )
})

watch([() => valid.value, () => part.value, () => members.value], (value, _, __) => {
  if (value) emit('correct', { members: members.value, part: part.value })
}, { deep: true })
</script>

<template>
  <div class="d-flex ga-4 align-start">
    <v-skeleton-loader
      :loading="!usersStore.user"
      type="image"
      height="10vh"
      width="200"
      class="bg-transparent long-skeleton flex-shrink-0"
    >
      <v-text-field
        :value="usersStore.user?.name"
        label="Участник"
        variant="outlined"
        class="text-darktext"
        max-width="200"
        readonly
        persistent-placeholder
      />
    </v-skeleton-loader>
    —
    <v-text-field
      v-model="part"
      label="Партия"
      :rules="partRules"
      variant="outlined"
      class="text-darktext"
    />
  </div>
  <div
    v-for="(member, index) in members"
    :key="index"
    class="d-flex ga-4 align-start"
  >
    <v-skeleton-loader
      :loading="!(usersStore.user && rawUsers)"
      type="button"
      class="bg-transparent long-skeleton"
    >
      <v-autocomplete
        v-model="member.userId"
        :item-props="true"
        :items="getFormatedUsers(member.userId)"
        :list-props="{ bgColor: 'themewhite' }"
        label="Участник"
        :rules="memberRules"
        variant="outlined"
        class="text-darktext"
        max-width="200"
        :menu-props="{ transition: 'fade-transition' }"
      />
    </v-skeleton-loader>
    —
    <v-text-field
      v-model="member.part"
      label="Партия"
      :rules="partRules"
      variant="outlined"
      class="text-darktext"
    />

    <v-btn
      icon="mdi-delete-outline"
      variant="text"
      color="error"
      @click="removeMember(index)"
    />
  </div>

  <v-btn
    color="secondary"
    variant="outlined"
    class="mb-4"
    width="100%"
    prepend-icon="mdi-plus"
    @click="addMember"
  >
    Добавить участника
  </v-btn>
</template>

<style scoped>
</style>
