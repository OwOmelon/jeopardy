<script setup lang="ts">
import { ref, computed } from "vue";

import type { ImageModelValue } from "./TableDataEditor.vue";

import IconQuestionMark from "~icons/material-symbols/question-mark-rounded";
import IconAddPhoto from "~icons/material-symbols/add-a-photo-outline-rounded";
import TextBox from "@/components/TextBox.vue";

const props = defineProps<{
	label: string;
	text: string;
	image: string;
	textBoxPlaceholder: string;
}>();

const emit = defineEmits<{
	"update:text": [string];
	"on-image-upload": [ImageModelValue];
	"show-help_image": [];
}>();

const helpImgBtn = ref<HTMLElement | null>(null);
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

	reader.onload = () => {
		emit("on-image-upload", { src: reader.result as string, type: "upload" });
	};

	if (file) {
		reader.readAsDataURL(file);
	}
}

function helpHint(): void {
	helpImgBtn.value!.classList.remove("help-hint");
	setTimeout(() => {
		helpImgBtn.value!.classList.add("help-hint");
	}, 20);
}
</script>

<template>
	<div class="shadow-subtle flex flex-col gap-3 rounded bg-stone-700 p-3">
		<label class="text-stone-300">{{ label }}</label>
		<TextBox
			v-model="computedModelValue"
			:placeholder="textBoxPlaceholder"
			focus-classes="!border-stone-100"
			class="input min-h-[10.3ex] cursor-text md:min-h-[18.2ex]"
		/>

		<div class="flex items-center gap-3">
			<i class="h-px grow bg-stone-500" />

			<button
				type="button"
				:disabled="!image"
				class="shadow-subtle rounded bg-stone-500 px-2 text-center text-sm text-stone-50 transition-[filter] hover:brightness-125 disabled:pointer-events-none disabled:bg-transparent disabled:text-stone-400 disabled:shadow-none"
				@click="emit('on-image-upload', null)"
			>
				{{ image ? "remove" : "add an" }} image
			</button>

			<button
				ref="helpImgBtn"
				type="button"
				class="shadow-subtle rounded-full border-2 border-transparent bg-stone-500 p-px text-stone-100 transition-[filter] hover:brightness-125"
				@click="emit('show-help_image')"
			>
				<IconQuestionMark class="h-4 w-4" />
			</button>

			<i class="h-px grow bg-stone-500" />
		</div>

		<div v-if="image">
			<img :src="image" class="mx-auto max-h-[300px] rounded" />
		</div>

		<div v-else class="flex gap-3">
			<div
				class="btn relative flex cursor-pointer items-center justify-center gap-2 hover:!border-stone-100"
				@mouseenter="helpHint"
				@click="uploadImgBtn?.click()"
			>
				upload
				<IconAddPhoto class="scale-125" />

				<input
					ref="uploadImgBtn"
					type="file"
					class="pointer-events-none fixed -top-full opacity-0"
					@change="onImageUpload"
				/>

				<span
					v-if="notAnImageWarning"
					:key="notAnImageWarning"
					class="popup pointer-events-none absolute whitespace-nowrap rounded bg-yellow-400 p-2 text-sm text-black"
				>
					that's not an image, silly !
				</span>
			</div>

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
	@apply shadow-subtle rounded border-2 border-transparent bg-stone-600 p-[0.5em] text-stone-50 outline-none transition-colors focus:border-stone-100;
}

.help-hint {
	animation: help-hint 2s forwards linear;
}

@keyframes help-hint {
	0%,
	34%,
	67%,
	100% {
		border-color: #0000;
		transform: translateY(0);
	}

	17%,
	50%,
	84% {
		border-color: #fff;
		transform: translateY(-0.25rem);
	}
}

.popup {
	animation: fade-slide-up 5s forwards;
}

@keyframes fade-slide-up {
	0%,
	100% {
		opacity: 0;
		transform: translateY(0px);
	}

	20%,
	80% {
		opacity: 1;
		transform: translateY(-3rem);
	}
}
</style>
