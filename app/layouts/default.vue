<script setup lang="ts">
import AppFooter from '~/components/appFooter.vue'
import { useUsersStore } from '~/stores/users'
import { gsap } from 'gsap'

const usersStore = useUsersStore()

function logOut() {
  usersStore.logOut()
}

const bgRef = ref(null)

watch(bgRef, (newVal) => {
  if (newVal) {
    const xTo = gsap.quickTo(bgRef.value, 'x', { duration: 0.8, ease: 'power2.out' })
    const yTo = gsap.quickTo(bgRef.value, 'y', { duration: 0.8, ease: 'power2.out' })

    window.addEventListener('mousemove', (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
    })
  }
})
</script>

<template>
  <ColorScheme tag="div">
    <v-app>
      <v-app-bar
        color="headfoot"
        elevation="0"
      >
        <v-btn
          variant="text"
          to="/"
          color="transparent"
        >
          <v-img
            width="64"
            height="64"
            aspect-ratio="1/1"
            src="~/assets/logo.jpg"
          />
        </v-btn>

        <v-btn
          variant="text"
          to="/"
          color="transparent"
        >
          <v-app-bar-title class="text-white">
            Now Or Never
          </v-app-bar-title>
        </v-btn>

        <v-spacer />

        <div class="d-none d-sm-flex">
          <v-btn
            variant="text"
            to="/"
          >
            Главная
          </v-btn>
          <v-btn
            v-if="usersStore.user?.role === 'admin'"
            variant="text"
            to="/project/newProject"
          >
            Новый проект
          </v-btn>
          <v-btn
            variant="text"
            to="/login"
            @click="logOut"
          >
            Выход
          </v-btn>
        </div>
        <div class="d-sm-none">
          <v-menu transition="fade-transition">
            <template #activator="{ props }">
              <v-btn
                icon="mdi-menu"
                variant="text"
                v-bind="props"
              />
            </template>

            <v-list class="bg-themewhite">
              <v-list-item to="/">
                <v-list-item-title>Главная</v-list-item-title>
              </v-list-item>

              <v-list-item
                v-if="usersStore.user?.role === 'admin'"
                to="/project/newProject"
              >
                <v-list-item-title>Новый проект</v-list-item-title>
              </v-list-item>

              <v-list-item
                to="/login"
                @click="logOut"
              >
                <v-list-item-title>Выход</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-app-bar>
      <v-main class="d-flex align-center justify-center main-container bg-primary">
        <div class="bg-wrapper">
          <div
            ref="bgRef"
            class="glow-spot"
          />
        </div>

        <v-container class="content-wrapper">
          <slot />
        </v-container>
      </v-main>
      <app-footer
        color="headfoot"
      />
    </v-app>
  </ColorScheme>
</template>

<style scoped>
.v-main {
  padding-top: 64px !important;
}

.main-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.bg-wrapper {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.glow-spot {
  position: fixed;
  width: 600px;
  height: 600px;
  margin-left: -300px;
  margin-top: -300px;
  background: radial-gradient(
    circle,
    rgb(var(--v-theme-glow)), 30%,
    transparent 70%
  );

  border-radius: 50%;
  pointer-events: none;
  filter: blur(15px);

  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 1;
}
</style>
