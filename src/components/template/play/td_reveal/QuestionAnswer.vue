<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";

const props = defineProps<{
	showAnswer: boolean;
}>();

const { activeCell } = useTemplateStore();

const ImgAltTxt = (type: string) => {
	return `image for ${type} of ${
		activeCell!.category || activeCell!.column
	} for ${activeCell!.points} points`;
};
</script>

<template>
	<div class="grid">
		<div class="overflow-hidden">
			<div v-if="activeCell!.question.image" class="image-wrapper">
				<img :src="activeCell!.question.image" :alt="ImgAltTxt('question')" />
			</div>

			<p class="text-xl">{{ activeCell!.question.text }}</p>

			<Transition
				name="height-auto"
				enter-active-class="duration-1000"
				leave-active-class="duration-1000"
			>
				<div v-if="props.showAnswer" class="grid">
					<div class="overflow-hidden">
						<hr class="my-5 border-t-2 border-red-400" />

						<div v-if="activeCell!.answer.image" class="image-wrapper">
							<img :src="activeCell!.answer.image" :alt="ImgAltTxt('answer')" />
						</div>

						<p class="text-3xl font-bold">
							{{ activeCell!.answer.text }}
						</p>
					</div>
				</div>
			</Transition>

			<span
				v-if="activeCell!.answeredBy !== undefined"
				class="font-xl text-red mt-10 block font-bold"
			>
				answered by: {{ activeCell!.answeredBy ?? "no one" }}
			</span>
		</div>
	</div>
</template>

<style scoped lang="postcss">
p {
	@apply break-words;
}

.image-wrapper {
	@apply mx-auto mb-6 w-fit p-2;
}

img {
	@apply rounded shadow shadow-black/30;
}
</style>
