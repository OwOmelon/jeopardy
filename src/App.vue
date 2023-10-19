<script setup lang="ts">
import { useTemplateStore } from "./stores/template";

import debug from "./components/debug.vue";
import MainMenu from "./components/MainMenuModal/Modal.vue";
import ShowMainMenuBtn from "./components/MainMenuModal/ShowMainMenuBtn.vue";
import Template from "./components/template/Template.vue";
import GuestList from "./components/guests/GuestList.vue";
import TDEditor from "./components/template/TDEditor.vue";
import TDReveal from "./components/tdreveal/TDReveal.vue";
import ModalWrapper from "./components/ModalWrapper.vue";
import TemplateHistory from "./components/template_history/History.vue";

const template = useTemplateStore();
</script>

<template>
  <ShowMainMenuBtn />
  <MainMenu />

  <TemplateHistory v-if="template.editing" />

  <Template />
  <GuestList />

  <ModalWrapper
    :show="template.activeCell && template.editing ? true : false"
  >
    <TDEditor />
  </ModalWrapper>

  <ModalWrapper
    :show="template.activeCell && !template.editing ? true : false"
  >
    <TDReveal />
  </ModalWrapper>

  <debug />
</template>

<style lang="postcss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;600;800&display=swap");

*,
*::before,
*::after {
  @apply m-0 box-border p-0;
}

html {
  @apply bg-stone-100 font-["Poppins",_sans-serrif] text-stone-500 text-sm lg:text-base;
}

#app {
  @apply flex min-h-screen flex-col items-center justify-center;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.th:has(.textbox:focus) {
  @apply -translate-y-2 scale-110 !cursor-text;
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

.height-auto {
  &-enter-active,
  &-leave-active {
    transition:
      grid-template-rows 300ms,
      opacity 300ms;
  }

  &-enter-from,
  &-leave-to {
    grid-template-rows: 0fr;
    opacity: 0;
  }

  &-enter-to,
  &-leave-from {
    grid-template-rows: 1fr;
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
