<script setup lang="ts">
import { computed } from "vue";
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

const computedModelValue = computed<string>({
	get() {
		return props.text;
	},

	set(newText) {
		emit("update:text", newText);
	},
});
</script>

<template>
	<div>
		<label>{{ label }}</label>
		<TextBox
			v-model="computedModelValue"
			:placeholder="textBoxPlaceholder"
			focus-classes="!border-stone-100"
			class="input mt-3 min-h-[10.3ex] md:min-h-[18.2ex]"
		/>
	</div>
</template>

<style scoped lang="postcss">
.input {
	@apply rounded border-2 border-transparent bg-stone-500 p-[0.5em] text-stone-100 shadow shadow-black/30 outline-none transition-colors;
}
</style>
