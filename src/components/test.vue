<script setup>
import { useTextareaAutosize } from "@vueuse/core";
const { textarea, input } = useTextareaAutosize();

const testinput = ref("");
</script>

<template>
   <div>
      <div>
         <textarea
            ref="textarea"
            v-model="input"
            class="w-96 resize-none"
            placeholder="alright now what's all this then"
         />
         <p class="w-96">{{ input }}//</p>
      </div>
      <br />

      <typeinputtest
         v-model="testinput"
         class="bg-[#fff]"
         placeholder="alright now what's all this then"
      />
      <p>{{ testinput }}//</p>
   </div>
</template>
