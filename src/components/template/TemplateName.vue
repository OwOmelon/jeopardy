<script setup lang="ts">
import { ref, watch } from "vue";
import { useTemplateStore } from "@/stores/template";

import TextBox from "@/components/TextBox.vue";

const template = useTemplateStore();

const textInput = ref<string>(template.name);

watch(
	() => template.name,
	(name) => {
		textInput.value = name;
	},
);
</script>

<template>
	<div class="mx-auto w-fit">
		<div
			:class="[
				'mx-auto block w-fit min-w-[3.3em] max-w-[95vw] text-center text-[5.61rem] font-bold',
			]"
		>
			<TextBox
				v-model="textInput"
				placeholder="name"
				:disabled="!template.editing"
				blur-on-keydown-enter
				:class="[
					template.editing ? 'text-stone-300' : 'text-stone-700',
					'p-2 transition-colors',
				]"
				@blur="template.name = textInput"
			/>
		</div>

		<hr
			:class="[
				{ 'opacity-0': textInput },
				'border-flash rounded-full border-t-4 transition-opacity duration-500',
			]"
		/>
	</div>
</template>

<style scoped lang="postcss">
.border-flash {
	animation: border-flash 5s infinite;
}

@keyframes border-flash {
	0%,
	25%,
	50%,
	75%,
	100% {
		border-color: theme("colors.stone.600");
	}

	12.5%,
	37.5%,
	62.5% {
		border-color: theme("colors.red.400");
	}
}
</style>
