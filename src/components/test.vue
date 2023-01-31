<script setup>
const warning = ref(0);
</script>

<template>
   <div class="w-1/2">
      <Transition
         :name="warning < 2 ? 'fade' : 'shake'"
         leave-active-class="absolute duration-150"
      >
         <div
            v-if="warning"
            :key="warning"
            class="bg-red-400 w-96 p-2 rounded text-[#fff] text-4xl font-bold"
         >
            WARNING
         </div>
      </Transition>
      <button @click="warning++">show warning</button>
      <button @click="warning = 0">reset count</button>
      <p>{{ warning }}</p>
   </div>
</template>

<style lang="scss" scoped>
.shake-enter-active {
   animation: shake 0.82s;
}

.shake-leave-active {
   animation: shake 0.82s reverse;
}

.shake {
   animation: shake cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
   transform: translate3d(0, 0, 0);
}

@keyframes shake {
   10%,
   90% {
      transform: translate3d(-1px, 0, 0);
   }

   20%,
   80% {
      transform: translate3d(4px, 0, 0);
   }

   30%,
   50%,
   70% {
      transform: translate3d(-6px, 0, 0);
   }

   40%,
   60% {
      transform: translate3d(6px, 0, 0);
   }
}
</style>
