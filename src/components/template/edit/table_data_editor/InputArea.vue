<script setup lang="ts">
import { ref, computed } from "vue";

import { Icon } from "@iconify/vue";
import TextBox from "@/components/TextBox.vue";

const props = defineProps<{
	text: string;
	image: string;
	label: string;
	textBoxPlaceholder: string;
}>();

const emit = defineEmits<{
	"update:text": [string];
	"update:image": [string];
}>();

const imgInput = ref<HTMLInputElement | null>(null);

const computedModelValue = computed<string>({
	get() {
		return props.text;
	},

	set(newText) {
		emit("update:text", newText);
	},
});

function onImageUpload(e: any): void {
	const file = e.target!.files[0];
	const reader = new FileReader();

	if (!file.type.startsWith("image/")) return;

	reader.addEventListener("load", () => {
		emit("update:image", reader.result as string);
	});

	if (file) {
		reader.readAsDataURL(file);
	}
}
</script>

<template>
	<div
		class="flex flex-col gap-3 rounded bg-stone-600 p-3 shadow shadow-black/30"
	>
		<label>{{ label }}</label>
		<TextBox
			v-model="computedModelValue"
			:placeholder="textBoxPlaceholder"
			focus-classes="!border-stone-100"
			class="input min-h-[10.3ex] md:min-h-[18.2ex]"
		/>

		<div class="flex items-center gap-3">
			<div class="h-px grow bg-stone-500" />
			<button
				type="button"
				:disabled="!image.trim()"
				:class="[
					image.trim() ? 'bg-stone-500 text-stone-300' : 'text-stone-400',
					'rounded px-2 text-center text-sm',
				]"
				@click="emit('update:image', '')"
			>
				{{ image.trim() ? "remove" : "add an" }} image
			</button>
			<div class="h-px grow bg-stone-500" />
		</div>

		<img
			v-if="image.trim()"
			:src="image"
			class="rounded shadow shadow-black/30"
		/>

		<div v-else class="flex gap-3">
			<label
				class="input flex cursor-pointer items-center hover:!border-stone-100"
			>
				<Icon
					icon="material-symbols:add-a-photo-outline-rounded"
					class="scale-125"
				/>
				<span class="ml-2">upload</span>

				<input
					type="file"
					class="fixed -top-full opacity-0"
					@change="onImageUpload"
				/>
			</label>

			<input
				ref="imgInput"
				type="text"
				placeholder="paste image link"
				size="1"
				class="input grow placeholder:text-white/50 focus:!border-stone-100"
				@keydown.enter="imgInput!.blur()"
				@blur="emit('update:image', imgInput!.value)"
			/>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.input {
	@apply rounded border-2 border-transparent bg-stone-500 p-[0.5em] text-stone-100 shadow shadow-black/30 outline-none transition-colors focus:border-stone-100;
}
</style>
