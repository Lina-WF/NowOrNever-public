<script setup lang="ts">
import AppFooter from '~/components/appFooter.vue'
import type { ComponentPublicInstance } from 'vue'
import { gsap } from 'gsap'

const bgImageRef = ref<HTMLElement | null>(null)
const formSheetRef = ref<ComponentPublicInstance | null>(null)

const runEnterAnimation = () => {
  return new Promise<void>((resolve) => {
    const tl = gsap.timeline({
      onComplete: resolve,
    })

    if (formSheetRef.value && bgImageRef.value) {
      tl.to(formSheetRef.value.$el, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: 'power2.in',
      })
        .to(bgImageRef.value, {
          filter: 'blur(0px)',
          scale: 1.4,
          duration: 1.5,
          ease: 'expo.out',
        }, '-=0.2')
    }
    else {
      resolve()
    }
  })
}

provide('animation', runEnterAnimation)
</script>

<template>
  <v-app>
    <div class="fill-height d-flex align-center justify-center box">
      <div
        ref="bgImageRef"
        class="bg-image"
      />

      <v-sheet
        ref="formSheetRef"
        class="mx-auto bg-transparent content"
        min-width="300px"
      >
        <slot />
      </v-sheet>
    </div>
    <app-footer
      color="transparent"
      class="permanentDark"
    />
  </v-app>
</template>

<style scoped>
</style>
