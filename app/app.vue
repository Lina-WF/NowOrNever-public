<script setup>
useSocketStore()

const colorMode = useColorMode()
const theme = useTheme()

watch(() => colorMode.value, (newMode) => {
  theme.change(newMode)
}, { immediate: true })
</script>

<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>
