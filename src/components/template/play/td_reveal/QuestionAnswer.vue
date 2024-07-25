<script setup lang="ts">
import { computed, inject } from "vue";
import { storeToRefs } from "pinia";
import { useTemplateStore } from "@/stores/template";

import IconEdit from "~icons/material-symbols/edit-rounded";
import HeightAuto from "@/components/HeightAutoTransitionWrapper.vue";

const emit = defineEmits<{
	"change-answeree": [];
}>();

const { activeTableDataCell } = storeToRefs(useTemplateStore());

const revealProgress = inject("reveal-progress") as number;
const showAnswer = computed<boolean>(() => revealProgress > 1);

const ImgAltTxt = (type: string) => {
	return `image for ${type} of ${
		activeTableDataCell.value!.category || activeTableDataCell.value!.column
	} for ${activeTableDataCell.value!.points} points`;
};
</script>

<template>
	<div class="font-bold">
		<HeightAuto
			:show="(activeTableDataCell!.answeredBy ? true : false) || !showAnswer"
			speed="slow"
		>
			<p>{{ activeTableDataCell!.question.text }}</p>

			<img
				v-if="activeTableDataCell!.question.image"
				:src="activeTableDataCell!.question.image"
				:alt="ImgAltTxt('question')"
			/>
		</HeightAuto>

		<hr
			v-if="activeTableDataCell!.answeredBy"
			class="my-5 rounded-full border-t-4 border-stone-600"
		/>

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
			class="shadow-subtle mx-auto mt-10 flex w-fit items-center gap-3 rounded bg-red-400 p-2 text-4xl font-bold tracking-wide text-white"
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
	@apply break-words leading-[120%];
}

img {
	@apply mx-auto mt-5 h-[300px] rounded;
}
</style>
