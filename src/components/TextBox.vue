<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const props = withDefaults(
	defineProps<{
		placeholder?: string;
		disabled?: boolean;
		blurOnKeydownEnter?: boolean;
	}>(),
	{
		placeholder: "string",
		disabled: false,
		blurOnKeydownEnter: false,
	},
);

const emit = defineEmits<{
	onBlur: [];
	onFocus: [];
}>();

const textbox = ref<HTMLSpanElement | null>(null);
const text = defineModel<string>({ required: true });
let stopTextWatcher = false;

function onPointerdown() {
	if (!textbox.value || props.disabled) return;

	textbox.value.contentEditable = "true";
	textbox.value.focus();
	emit("onFocus");
}

function onInput() {
	if (!textbox.value) return;

	text.value = textbox.value.innerText;
	stopTextWatcher = true;
}

function onBlur() {
	if (!textbox.value) return;

	textbox.value.contentEditable = "false";
	emit("onBlur");
}

function setPlaceholder(placeholder: typeof props.placeholder) {
	if (!textbox.value || typeof placeholder !== "string") return;

	textbox.value.style.setProperty("--placeholder", `"${placeholder}"`);
}

function addBlurOnKeydownEventListener() {
	if (!textbox.value) return;

	textbox.value.addEventListener("keydown", (e) => {
		if (e.code === "Enter") onBlur();
	});
}

watch(text, (t) => {
	if (!textbox.value) return;
	if (stopTextWatcher) {
		stopTextWatcher = false;
		return;
	}

	textbox.value.innerText = t;
});

watch(
	() => props.placeholder,
	(ph) => {
		if (textbox.value) setPlaceholder(ph);
	},
);

onMounted(() => {
	if (!textbox.value) return;

	textbox.value.innerText = text.value;
	setPlaceholder(props.placeholder);

	if (props.blurOnKeydownEnter) addBlurOnKeydownEventListener();
});
</script>

<template>
	<span
		ref="textbox"
		:data-hide-placeholder="text.trim() ? true : false"
		@pointerdown="onPointerdown"
		@input="onInput"
		@blur="onBlur"
	/>
</template>

<style scoped lang="postcss">
span {
	@apply block cursor-text outline-none;
}

span::before {
	content: var(--placeholder);

	@apply pointer-events-none opacity-50;
}

span[data-hide-placeholder="true"]::before {
	@apply !hidden;
}
</style>
