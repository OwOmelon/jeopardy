<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";

const props = defineProps<{
	showAnswer: boolean;
}>();

const { activeCell } = useTemplateStore();
</script>

<template>
	<div class="grid">
		<div class="overflow-hidden">
			<p class="text-xl">{{ activeCell!.question.text }}</p>

			<img
				v-if="activeCell!.question.image"
				:src="activeCell!.question.image"
				:alt="`image for question of ${
					activeCell!.category || activeCell!.column
				} for ${activeCell!.points}`"
				class="mx-auto"
			/>

			<Transition
				name="height-auto"
				enter-active-class="duration-1000"
				leave-active-class="duration-1000"
			>
				<div v-if="props.showAnswer" class="grid">
					<div class="overflow-hidden">
						<hr class="my-5 border-t-2 border-red-400" />

						<p class="text-3xl font-bold">
							{{ activeCell!.answer.text }}
						</p>

						<img
							v-if="activeCell!.answer.image"
							:src="activeCell!.answer.image"
							:alt="`image for answer of ${
								activeCell!.category || activeCell!.column
							} for ${activeCell!.points}`"
							class="mx-auto"
						/>
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

img {
	@apply mx-auto mt-3 rounded shadow shadow-black/30;
}
</style>
