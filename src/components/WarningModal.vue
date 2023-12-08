<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import { useMainMenuStore } from "@/stores/mainmenu";

const props = defineProps<{
	header: string;
	paragraph: string[];
	hideCancelBtn?: boolean;
}>();

const emit = defineEmits<{
	confirm: [];
	close: [];
}>();

const mainemenu = useMainMenuStore();

onMounted(() => {
	mainemenu.disableToggle = true;
});

onUnmounted(() => {
	mainemenu.disableToggle = false;
});
</script>

<template>
	<div
		class="component modal !max-w-[500px] bg-red-400 p-5 text-white"
		v-on-click-outside="
			() => {
				emit('close');
			}
		"
	>
		<h1 class="text-3xl font-bold">{{ header }}</h1>

		<div class="my-3">
			<p v-for="(text, key) in paragraph" :key="key">{{ text }}</p>
		</div>

		<slot></slot>

		<button v-if="!hideCancelBtn" type="button" @click="emit('close')">
			CANCEL
		</button>
		
		<button
			type="button"
			class="ml-3"
			@click="
				() => {
					emit('confirm');
					emit('close');
				}
			"
		>
			CONFIRM
		</button>
	</div>
</template>

<style scoped lang="postcss">
button {
	@apply rounded bg-white p-2 text-xl font-bold text-red-400 transition-transform hover:-translate-y-1;
}
</style>
