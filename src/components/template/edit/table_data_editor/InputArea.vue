<script setup lang="ts">
import { ref, computed } from "vue";

import type { ImageModelValue } from "./TableDataEditor.vue";

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
	"on-image-upload": [ImageModelValue];
}>();

const uploadImgBtn = ref<HTMLInputElement | null>(null);
const imgTextBox = ref<HTMLInputElement | null>(null);
const notAnImageWarning = ref<number>(0);

const computedModelValue = computed<string>({
	get() {
		return props.text;
	},

	set(newText) {
		emit("update:text", newText);
	},
});

function onImageUpload(): void {
	const file = uploadImgBtn.value!.files![0];
	const reader = new FileReader();

	uploadImgBtn.value!.value = "";

	if (!file.type.startsWith("image/")) {
		notAnImageWarning.value++;

		return;
	}

	reader.addEventListener("load", () => {
		emit("on-image-upload", { src: reader.result as string, type: "upload" });
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
			class="input min-h-[10.3ex] cursor-text md:min-h-[18.2ex]"
		/>

		<div class="flex items-center gap-3">
			<div class="h-px grow bg-stone-500" />
			<button
				type="button"
				:disabled="!image.trim()"
				:class="[
					image.trim()
						? 'bg-stone-500 text-stone-300 hover:brightness-125'
						: 'text-stone-400',
					'rounded px-2 text-center text-sm transition-[filter]',
				]"
				@click="emit('on-image-upload', null)"
			>
				{{ image.trim() ? "remove" : "add an" }} image
			</button>
			<div class="h-px grow bg-stone-500" />
		</div>

		<img
			v-if="image.trim()"
			:src="image"
			class="self-center rounded shadow shadow-black/30"
		/>

		<div v-else class="flex gap-3">
			<label
				class="btn relative flex cursor-pointer items-center justify-center hover:!border-stone-100"
			>
				<Icon
					icon="material-symbols:add-a-photo-outline-rounded"
					class="scale-125"
				/>
				<span class="ml-2">upload</span>

				<input
					ref="uploadImgBtn"
					type="file"
					class="fixed -top-full opacity-0"
					@change="onImageUpload"
				/>

				<span
					v-if="notAnImageWarning"
					:key="notAnImageWarning"
					class="not-an-image-warning-anim pointer-events-none absolute whitespace-nowrap rounded bg-yellow-400 p-2 text-sm text-black"
				>
					that's not an image, silly !
				</span>
			</label>

			<input
				ref="imgTextBox"
				type="text"
				placeholder="paste image link"
				size="1"
				class="input grow placeholder:text-white/50 focus:!border-stone-100"
				@keydown.enter="imgTextBox!.blur()"
				@blur="
					emit('on-image-upload', { src: imgTextBox!.value, type: 'link' })
				"
			/>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.input {
	@apply rounded border-2 border-transparent bg-stone-500 p-[0.5em] text-stone-100 shadow shadow-black/30 outline-none transition-colors focus:border-stone-100;
}

.not-an-image-warning-anim {
	animation: fade-slide-up 5s forwards;
}

@keyframes fade-slide-up {
	0%,
	100% {
		@apply -top-5 opacity-0;
	}

	20%,
	80% {
		@apply -top-12 opacity-100;
	}
}
</style>
