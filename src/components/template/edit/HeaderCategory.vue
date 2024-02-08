<script setup lang="ts">
import { ref, watch } from "vue";
import DragHandle from "@/components/DragHandle.vue";
import TextBox from "@/components/TextBox.vue";

import type { ColumnID } from "@/stores/template";

const props = defineProps<{
	column: ColumnID;
	category: string;
}>();

const emit = defineEmits<{
	"change-column-category": [ColumnID, typeof props.category];
}>();

const textInput = ref(props.category);

watch(
	() => props.category,
	(val) => {
		textInput.value = val;
	},
);
</script>

<template>
	<th class="cell cell-width cell-padding th-bg group relative">
		<TextBox
			v-model="textInput"
			:placeholder="props.column"
			blur-on-keydown-enter
			@blur="emit('change-column-category', props.column, textInput)"
		/>

		<DragHandle />
	</th>
</template>
