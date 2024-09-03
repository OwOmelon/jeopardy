<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const props = withDefaults(
	defineProps<{
		placeholder?: string;
		disabled?: boolean;
		blurOnKeydownEnter?: boolean;
		spanClasses?: string;
	}>(),
	{
		placeholder: `"\a0"`,
		disabled: false,
		blurOnKeydownEnter: false,
		spanClasses: "",
	},
);

const emit = defineEmits<{
	"on-blur": [];
	"on-focus": [];
}>();

const textbox = ref<HTMLSpanElement | null>(null);
const text = defineModel<string>({ required: true });
let stopTextWatcher = false;

function onInput() {
	if (!textbox.value) return;

	text.value = textbox.value.innerText;
	stopTextWatcher = true;
}

function setPlaceholder(placeholder: typeof props.placeholder) {
	if (!textbox.value || typeof placeholder !== "string") return;

	textbox.value.style.setProperty("--placeholder", `"${placeholder}"`);
}

function addBlurOnKeydownEventListener() {
	if (!textbox.value) return;

	textbox.value.addEventListener("keydown", (e) => {
		if (e.code === "Enter") textbox.value!.blur();
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
	<div>
		<span
			ref="textbox"
			:class="[spanClasses]"
			:contenteditable="!disabled"
			:data-hide-placeholder="text.trim() ? true : false"
			@input="onInput"
			@focus="emit('on-focus')"
			@blur="emit('on-blur')"
		/>
	</div>
</template>

<style scoped lang="postcss">
div {
	@apply relative;
}

span {
	@apply block h-full outline-none;
}

span::before {
	content: var(--placeholder);

	@apply pointer-events-none opacity-50;
}

span[data-hide-placeholder="true"]::before {
	@apply !hidden;
}
</style>
