<script setup lang="ts">
import RouteBtn from '~/components/btns/routeBtn.vue'

definePageMeta({
  layout: 'login-layout',
})

const router = useRouter()
const historyState = router.options.history.state

const code = historyState?.code ? historyState?.code.toString() : '404'
const reason = historyState?.reason as string || 'Страница не найдена'

const runEnterAnimation = inject('animation')! as () => Promise<void>

async function back() {
  await runEnterAnimation()
  navigateTo('/')
}
</script>

<template>
  <div>
    <v-empty-state
      :headline="code"
      :title="reason"
      class="permanentDark"
    />
    <RouteBtn
      width="100%"
      color="#021526"
      link=""
      :text="'На главную'"
      @click="back"
    />
  </div>
</template>

<style scoped>
</style>
