<script setup lang="ts">
import { useModesStore } from "./stores/modes";

import debug from "./components/debug.vue";
import MainMenu from "./components/MainMenuModal/Modal.vue";
import Template from "./components/template/Template.vue";

const modes = useModesStore();
</script>

<template>
  <MainMenu />
  <Template />

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
  @apply bg-stone-100 font-["Poppins",_sans-serrif] text-stone-500;
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

td {
  @apply h-20 cursor-pointer rounded bg-stone-300 p-2 text-stone-800 shadow !shadow-black/30 transition-[background-color,_color,_box-shadow,_transform] hover:-translate-y-2 hover:scale-105 hover:shadow-lg active:scale-100;
}

.td-missing-data {
  @apply !bg-stone-500 !text-stone-50;
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
