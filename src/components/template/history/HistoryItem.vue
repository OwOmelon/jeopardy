<script setup lang="ts">
import IconTabArrowLeft from "~icons/fluent/tab-arrow-left-24-regular";
import IconNoPhotography from "~icons/material-symbols/no-photography";
import HeightAuto from "@/components/HeightAutoTransitionWrapper.vue";

import type { RowID, ColumnID, HistoryTemplate } from "@/stores/template";

const props = defineProps<
	{
		isCurrentTemplate: boolean;
		isActive: boolean;
		showAnswers: boolean;
		showImages: boolean;
	} & HistoryTemplate
>();

const emit = defineEmits<{
	"load-save": [];
	"set-active-item": [];
	"toggle-show-answers": [];
	"toggle-show-images": [];
}>();

function getImg(row: RowID, column: ColumnID) {
	const imgLink = props.imageTable.links?.[row]?.[column];
	const imgUpload = props.imageTable.uploads?.[row]?.[column];

	return props.showAnswers
		? imgLink?.answer || imgUpload?.answer
		: imgLink?.question || imgUpload?.question;
}
</script>

<template>
	<li
		@click="emit('set-active-item')"
		:class="[
			isActive ? 'bg-white/20' : 'hover:bg-white/10',
			'group cursor-pointer rounded p-1 transition-colors duration-300',
		]"
	>
		<div class="group relative flex items-center justify-between">
			<p
				:class="[
					{ 'text-red-400': isCurrentTemplate },
					'font-bold transition-colors',
				]"
			>
				{{ iteration }} | date modified:
				{{ new Date(dateModified).toLocaleTimeString("en-US") }}
			</p>

			<div
				:class="[
					isCurrentTemplate
						? 'pointer-events-none opacity-0'
						: isActive
							? 'oapcity-100'
							: 'group-hover:opacity-100 lg:opacity-0',
					'order-2 ml-10 flex items-center gap-2 transition-opacity duration-300',
				]"
			>
				<IconTabArrowLeft
					@click.stop="emit('load-save')"
					class="peer order-1 h-5 w-5 transition-transform hover:scale-125"
				/>

				<p
					:class="[
						{ '!opacity-100': isActive },
						'whitespace-nowrap text-[0.7rem] opacity-0 transition-opacity peer-hover:opacity-100',
					]"
				>
					load template
				</p>
			</div>
		</div>

		<HeightAuto :show="isActive">
			<div class="flex flex-col gap-2">
				<hr class="mt-2 border-white" />
				<p>
					name:
					<span class="item ml-2 !inline font-bold">{{ name || "x" }}</span>
				</p>

				<div>
					<label>points:</label>
					<ul class="ml-2 inline-flex gap-2">
						<li
							v-for="(points, row, index) in rows"
							:key="row"
							class="item font-bold"
						>
							{{ points }}
						</li>
					</ul>
				</div>

				<div>
					<label>columns:</label>
					<ul class="grid grid-cols-5 gap-2">
						<li
							v-for="(category, column, index) in columns"
							:key="column"
							class="item"
						>
							<p class="font-bold">{{ category || column }}</p>
						</li>
					</ul>
				</div>

				<div>
					<div class="mb-2 flex gap-2">
						<label>table:</label>
						<button type="button" @click.stop="emit('toggle-show-answers')">
							show {{ showAnswers ? "questions" : "answers" }}
						</button>

						<button type="button" @click.stop="emit('toggle-show-images')">
							show {{ showImages ? "text" : "images" }}
						</button>
					</div>
					<table class="flex w-full flex-col gap-2 text-[0.65rem]">
						<tr
							v-for="(points, row, rowIndex) in rows"
							:key="row"
							class="grid grid-cols-5 gap-2"
						>
							<td
								v-for="(category, column, columnIndex) in columns"
								:key="column"
								class="item h-[9ex]"
							>
								<template v-if="showImages">
									<img
										v-if="getImg(row, column)"
										:src="getImg(row, column)"
										class="h-full object-contain"
									/>

									<IconNoPhotography v-else class="scale-125" />
								</template>

								<p v-else>
									{{
										showAnswers
											? textTable?.[row]?.[column]?.answer || "x"
											: textTable?.[row]?.[column]?.question || "x"
									}}
								</p>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</HeightAuto>
	</li>
</template>

<style scoped lang="postcss">
.item {
	@apply flex items-center justify-center overflow-hidden bg-white/20 px-2 text-center;
}

.item p {
	@apply line-clamp-3 w-full break-words;
}

button {
	@apply border-[1px] border-stone-200 bg-stone-200 px-2 font-bold text-stone-600 transition-colors hover:bg-transparent hover:text-stone-200;
}
</style>
