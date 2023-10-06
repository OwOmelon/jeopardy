<script setup lang="ts">
import { ref, watch } from "vue";
import { useTemplateStore } from "@/stores/template";
import { Icon } from "@iconify/vue";
import type { Category, RawTable, RawTemplateData } from "@/stores/template";

const emit = defineEmits<{
	(e: "load-save", save: RawTemplateData): void;
	(e: "set-active-item", index: number): void;
}>();

const props = defineProps<{
	template: RawTemplateData;
	index: number;
	isActive: boolean;
}>();

const jeop = useTemplateStore();

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

const toggleShowTableAnswers = (e: Event): void => {
	e.stopPropagation();
	showTableAnswers.value = !showTableAnswers.value;
};

watch(
	() => props.isActive,
	(value) => {
		if (value!) {
			showTableAnswers.value = false;
		}
	}
);
</script>

<template>
	<li
		@click="$emit('set-active-item', index)"
		:class="[
			isActive ? 'bg-white/20' : 'hover:bg-white/10',
			'group p-1 rounded cursor-pointer duration-300',
		]"
	>
		<div class="group relative flex items-center">
			<p
				:class="[
					jeop.currentTemplateID === template.id
						? 'text-red-400'
						: 'text-white',
					'font-bold duration-150',
				]"
			>
				save {{ template.id }}
			</p>

			<div
				:class="[
					jeop.currentTemplateID === template.id
						? 'opacity-0 pointer-events-none'
						: isActive
						? 'oapcity-100'
						: 'opacity-0 group-hover:opacity-100',
					'absolute right-0 flex items-center duration-300',
				]"
			>
				<Icon
					icon="fluent:tab-arrow-left-24-regular"
					@click="(e: Event) => {e.stopPropagation(); $emit('load-save', template)}"
					class="peer w-5 h-5 hover:scale-125 duration-150"
				/>

				<p
					class="absolute -left-[90px] opacity-0 peer-hover:opacity-100 whitespace-nowrap duration-150"
				>
					load this save
				</p>
			</div>
		</div>

		<Transition name="ohyea">
			<div v-if="isActive" class="grid">
				<div class="flex flex-col gap-2 overflow-hidden">
					<p>template name: {{ props.template.templateName || "x" }}</p>

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
								<p>{{ column.category || column.id }}</p>
							</li>
						</ul>
					</div>

					<div>
						<div class="flex gap-2 mb-2">
							<label>table:</label>
							<button
								type="button"
								@click="(e: Event) => toggleShowTableAnswers(e)"
								class="hover:bg-white/20 font-bold duration-150"
							>
								{{
									`show table ${
										showTableAnswers ? "questions" : "answers"
									}`
								}}
							</button>
						</div>
						<table class="flex flex-col gap-2 w-full text-[0.65rem]">
							<tr
								v-for="(row, rowIndex) in rawTable"
								:key="rowIndex"
								class="stretch grid grid-cols-5 gap-2"
							>
								<td
									v-for="(cell, columnIndex) in row"
									:key="columnIndex"
									class="flex justify-center items-center bg-white/20 w-full h-[4rem] text-center"
								>
									<p
										class="max-h-full line-clamp-4 text-ellipsis overflow-hidden"
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
		transition: max-height opacity 300ms;
	}

	&-enter-from,
	&-leave-to {
		max-height: 0;
		opacity: 0;
	}

	&-enter-to,
	&-leave-from {
		max-height: 456px;
	}
}

.ohyea {
	&-enter-active,
	&-leave-active {
		transition: grid-template-rows 300ms, opacity 300ms;
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
