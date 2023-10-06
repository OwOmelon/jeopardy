<script setup lang="ts">
import { ref, watch } from "vue";
import { useTemplateStore } from "@/stores/template";
import { Icon } from "@iconify/vue";

import type { RawTable, RawTemplateData } from "@/stores/template";

const props = defineProps<{
	template: RawTemplateData;
	index: number;
	isActive: boolean;
}>();

const emit = defineEmits<{
	(e: "load-save", save: RawTemplateData): void;
	(e: "set-active-item", index: number): void;
}>();

const template = useTemplateStore();

const rawTable: RawTable = props.template.rows.reduce((rows, row) => {
	return {
		...rows,
		[row]: props.template.columns.reduce((columns, column) => {
			return {
				...columns,
				[column.id]: props.template.rawTable[row][column.id],
			};
		}, {}),
	};
}, {});

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
			'group cursor-pointer rounded p-1 duration-300',
		]"
	>
		<div class="group relative flex items-center">
			<p
				:class="[
					props.template.id === template.id ? 'text-red-400' : 'text-white',
					'font-bold duration-150',
				]"
			>
				save {{ props.template.id }}
			</p>

			<div
				:class="[
					template.id === props.template.id
						? 'pointer-events-none opacity-0'
						: props.isActive
						? 'oapcity-100'
						: 'opacity-0 group-hover:opacity-100',
					'absolute right-0 flex items-center duration-300',
				]"
			>
				<Icon
					icon="fluent:tab-arrow-left-24-regular"
					@click.stop="emit('load-save', props.template)"
					class="peer h-5 w-5 duration-150 hover:scale-125"
				/>

				<p
					class="absolute -left-[90px] whitespace-nowrap opacity-0 duration-150 peer-hover:opacity-100"
				>
					load this save
				</p>
			</div>
		</div>

		<Transition name="grow">
			<div v-if="props.isActive" class="grid">
				<div class="flex flex-col gap-2 overflow-hidden">
					<p>template name: {{ props.template.name || "x" }}</p>

					<div class="flex gap-2">
						<label>points:</label>
						<ul class="flex gap-2">
							<li
								v-for="(point, index) in props.template.points"
								:key="index"
								class="bg-white/20 text-center"
							>
								{{ point }}
							</li>
						</ul>
					</div>

					<div class="flex gap-2">
						<label>columns:</label>
						<ul class="flex gap-2">
							<li
								v-for="(column, index) in props.template.columns"
								:key="index"
								class="flex items-center bg-white/20 text-center"
							>
								<p>{{ column.name || column.id }}</p>
							</li>
						</ul>
					</div>

					<div>
						<div class="mb-2 flex gap-2">
							<label>table:</label>
							<button
								type="button"
								@click.stop="showTableAnswers = !showTableAnswers"
								class="font-bold duration-150 hover:bg-white/20"
							>
								{{ `show table ${showTableAnswers ? "questions" : "answers"}` }}
							</button>
						</div>
						<table class="flex w-full flex-col gap-2 text-[0.65rem]">
							<tr
								v-for="(row, rowIndex) in rawTable"
								:key="rowIndex"
								class="stretch grid grid-cols-5 gap-2"
							>
								<td
									v-for="(cell, columnIndex) in row"
									:key="columnIndex"
									class="flex h-[4rem] w-full items-center justify-center bg-white/20 text-center"
								>
									<p
										class="line-clamp-4 max-h-full overflow-hidden text-ellipsis"
									>
										{{
											showTableAnswers
												? cell.answer || "x"
												: cell.question || "x"
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

<style lang="scss" scoped>
.grow {
	&-enter-active,
	&-leave-active {
		transition:
			grid-template-rows 300ms,
			opacity 300ms;
	}

	&-enter-from,
	&-leave-to {
		grid-template-rows: 0fr;
		opacity: 0;
	}

	&-enter-to,
	&-leave-from {
		grid-template-rows: 1fr;
	}
}
</style>
