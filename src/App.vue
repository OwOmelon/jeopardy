<script setup lang="ts">
import { useModesStore } from './stores/modes'

import debug from "./components/debug.vue";
import MainMenu from "./components/MainMenuModal/Modal.vue";
import TemplateEditor from "./components/edit/TemplateEditor.vue";
import PlayTable from "./components/play/Table.vue";

const modes = useModesStore()
</script>

<template>
  <MainMenu />
  <Transition name="fade">
    <TemplateEditor v-if="modes.current === 'edit'" />
    <PlayTable v-else-if="modes.current === 'play'" />
  </Transition>

  <debug />
</template>

<style lang="postcss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;600;800&display=swap");

*,
*::before,
*::after {
  @apply m-0 box-border p-0;
}

body {
  @apply bg-stone-200 font-["Poppins",_sans-serrif] text-stone-500;
}

#app {
  @apply grid min-h-screen place-items-center;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>

<style lang="scss">
.fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 150ms;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}

.list-slide-left {
  &-move,
  &-enter-active,
  &-leave-active {
    transition: all 300ms ease-out;
  }

  &-leave-active {
    position: absolute;
  }

  &-enter-from {
    opacity: 0;
    transform: translateX(25px);
  }

  &-leave-to {
    opacity: 0;
    transform: translateX(-25px);
  }
}

.nested-fade-slide-down {
  &-enter-active,
  &-leave-active {
    transition: all 300ms ease-in-out;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }

  &-enter-active .component,
  &-leave-active .component {
    transition: all 300ms ease-in-out;
  }

  &-enter-from .component,
  &-leave-to .component {
    transform: translateY(-15px);
    opacity: 0.001;
  }
}

.breathe {
  animation: breathe 1s ease-in-out infinite;
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}
</style>

<style lang="postcss">
.th:has(.textbox:focus) {
  @apply -translate-y-2 scale-110 !cursor-text;
}
</style>
