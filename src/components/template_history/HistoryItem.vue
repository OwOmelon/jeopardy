<script setup lang="ts">
import { ref, watch } from "vue";
import { Icon } from "@iconify/vue";

import type { TemplateData } from "@/stores/template";
import type { HistoryTemplate } from "./History.vue";

const props = defineProps<{
	template: HistoryTemplate;
	index: number;
	isCurrentTemplate: boolean;
	isActive: boolean;
}>();

const emit = defineEmits<{
	(e: "load-save", save: TemplateData): void;
	(e: "set-active-item", index: number): void;
}>();

const showTableAnswers = ref<boolean>(false);

watch(
	() => props.isActive,
	() => {
		showTableAnswers.value = false;
	},
);
</script>

<template>
	<li
		@click="emit('set-active-item', props.index)"
		:class="[
			props.isActive ? 'bg-white/20' : 'hover:bg-white/10',
			'group cursor-pointer rounded p-1 transition-colors duration-300',
		]"
	>
		<div class="group relative flex items-center justify-between">
			<p
				:class="[
					props.isCurrentTemplate ? 'text-red-400' : 'text-white',
					'font-bold transition-colors',
				]"
			>
				{{ props.template.iteration }} | date modified:
				{{ new Date(props.template.dateModified).toLocaleTimeString("en-US") }}
			</p>

			<div
				:class="[
					props.isCurrentTemplate
						? 'pointer-events-none opacity-0'
						: props.isActive
						? 'oapcity-100'
						: 'group-hover:opacity-100 lg:opacity-0',
					'order-2 ml-10 flex items-center gap-2 transition-opacity duration-300',
				]"
			>
				<Icon
					icon="fluent:tab-arrow-left-24-regular"
					@click.stop="emit('load-save', props.template)"
					class="peer order-1 h-5 w-5 transition-transform hover:scale-125"
				/>

				<p
					class="whitespace-nowrap text-[0.7rem] transition-opacity peer-hover:opacity-100 lg:opacity-0"
				>
					load template
				</p>
			</div>
		</div>

		<Transition name="height-auto">
			<div v-if="props.isActive" class="grid">
				<div class="flex flex-col gap-3 overflow-hidden">
					<p>template name: {{ props.template.name || "x" }}</p>

					<div>
						<label>points:</label>
						<ul class="flex gap-2">
							<li
								v-for="(point, index) in props.template.points"
								:key="index"
								class="item"
							>
								{{ point }}
							</li>
						</ul>
					</div>

					<div>
						<label>columns:</label>
						<ul class="grid grid-cols-5 gap-2">
							<li
								v-for="(column, index) in props.template.columns"
								:key="index"
								class="item"
							>
								<p>{{ column.category || column.id }}</p>
							</li>
						</ul>
					</div>

					<div>
						<div class="mb-2 flex gap-2">
							<label>table:</label>
							<button
								type="button"
								@click.stop="showTableAnswers = !showTableAnswers"
								class="font-bold transition-colors hover:bg-white/20"
							>
								{{ `show table ${showTableAnswers ? "questions" : "answers"}` }}
							</button>
						</div>
						<table class="flex w-full flex-col gap-2 text-[0.65rem]">
							<tr
								v-for="row in props.template.rows"
								:key="row"
								class="grid grid-cols-5 gap-2"
							>
								<td
									v-for="column in props.template.columns"
									:key="column.id"
									class="item h-[9ex]"
								>
									<p>
										{{
											showTableAnswers
												? props.template.rawTable[row][column.id].answer || "x"
												: props.template.rawTable[row][column.id].question ||
												  "x"
										}}
									</p>
								</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		</Transition>
	</li>
</template>

<style scoped lang="postcss">
.item {
	@apply grid place-items-center bg-white/20 text-center;
}

.item p {
	@apply line-clamp-3 w-full break-words;
}
</style>
