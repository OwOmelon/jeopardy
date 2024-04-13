<script setup lang="ts">
import IconEdit from "~icons/material-symbols/edit-rounded";
import HeightAuto from "@/components/HeightAutoTransitionWrapper.vue";

import type { TableDataCell } from "@/stores/template";

const props = defineProps<{
	activeTableDataCell: TableDataCell;
	showAnswer: boolean;
}>();

const emit = defineEmits<{
	"change-answeree": [];
}>();

const ImgAltTxt = (type: string) => {
	return `image for ${type} of ${
		props.activeTableDataCell.category || props.activeTableDataCell.column
	} for ${props.activeTableDataCell.points} points`;
};
</script>

<template>
	<div class="font-bold text-stone-600">
		<HeightAuto :show="!showAnswer" speed="slow">
			<p>{{ activeTableDataCell!.question.text }}</p>

			<img
				v-if="activeTableDataCell!.question.image"
				:src="activeTableDataCell!.question.image"
				:alt="ImgAltTxt('question')"
			/>
		</HeightAuto>

		<HeightAuto :show="showAnswer" speed="slow">
			<p>
				{{ activeTableDataCell!.answer.text }}
			</p>

			<img
				v-if="activeTableDataCell!.answer.image"
				:src="activeTableDataCell!.answer.image"
				:alt="ImgAltTxt('answer')"
			/>
		</HeightAuto>

		<div
			v-if="activeTableDataCell!.answeredBy"
			class="shadow-subtle mx-auto mt-10 flex w-fit items-center gap-3 rounded bg-red-400 p-2 font-bold tracking-wide text-white"
		>
			answered by: {{ activeTableDataCell!.answeredBy ?? "no one" }}

			<button
				type="button"
				class="shadow-subtle rounded bg-white p-2 text-red-400 transition-[box-shadow,_transform] hover:-translate-y-1 hover:shadow-md"
				@click="emit('change-answeree')"
			>
				<IconEdit />
			</button>
		</div>
	</div>
</template>

<style scoped lang="postcss">
p {
	@apply mb-5 break-words leading-[120%];
}

img {
	@apply mx-auto h-[300px] rounded;
}
</style>
