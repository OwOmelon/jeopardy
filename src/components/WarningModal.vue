<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import { useMainMenuStore } from "@/stores/mainmenu";

const props = defineProps<{
	header: string;
	paragraph: string[];
	hideConfirmBtn?: boolean;
}>();

const emit = defineEmits<{
	confirm: [];
	close: [];
}>();

const mainemenu = useMainMenuStore();

onMounted(() => {
	mainemenu.show = false;
	mainemenu.disableToggle = true;
});

onUnmounted(() => {
	mainemenu.disableToggle = false;
});
</script>

<template>
	<div
		class="modal flex !max-w-[500px] flex-col gap-3 bg-red-400 p-5 text-white"
		v-on-click-outside="
			() => {
				emit('close');
			}
		"
	>
		<h1 class="text-3xl font-bold">{{ header }}</h1>

		<div>
			<p v-for="(text, key) in paragraph" :key="key">{{ text }}</p>
		</div>

		<slot></slot>

		<div class="flex gap-3">
			<button type="button" @click="emit('close')">
				{{ hideConfirmBtn ? "CLOSE" : "CANCEL" }}
			</button>

			<button
				v-if="!hideConfirmBtn"
				type="button"
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
	</div>
</template>

<style scoped lang="postcss">
button {
	@apply shadow-subtle grow rounded bg-white p-2 text-xl font-bold text-red-400 transition-transform hover:-translate-y-1;
}
</style>
