<script setup lang="ts">
import { Icon } from "@iconify/vue";

import type { HistoryTemplate } from "@/stores/template";

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
					isCurrentTemplate ? 'text-red-400' : 'text-white',
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
				<Icon
					icon="fluent:tab-arrow-left-24-regular"
					@click.stop="emit('load-save')"
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
			<div v-if="isActive" class="grid">
				<div class="flex flex-col gap-3 overflow-hidden">
					<p>template name: {{ name || "x" }}</p>

					<div>
						<label>points:</label>
						<ul class="flex gap-2">
							<li v-for="(points, row, index) in rows" :key="row" class="item">
								{{ points }}
							</li>
						</ul>
					</div>

					<div>
						<label>columns:</label>
						<ul class="grid grid-cols-5 gap-2">
							<li v-for="(category, column, index) in columns" :key="column" class="item">
								<p>{{ category || column }}</p>
							</li>
						</ul>
					</div>

					<div>
						<div class="mb-2 flex gap-2">
							<label>table:</label>
							<button
								type="button"
								@click.stop="emit('toggle-show-answers')"
								class="font-bold transition-colors hover:bg-white/20"
							>
								{{ `show table ${showAnswers ? "questions" : "answers"}` }}
							</button>

							<button
								type="button"
								@click.stop="emit('toggle-show-images')"
								class="font-bold transition-colors hover:bg-white/20"
							>
								{{ `${showImages ? "hide" : "show"} images` }}
							</button>
						</div>
						<table class="flex w-full flex-col gap-2 text-[0.65rem]">
							<tr v-for="points, row, rowIndex in rows" :key="row" class="grid grid-cols-5 gap-2">
								<td
									v-for="category, column, columnIndex in columns"
									:key="column"
									class="item h-[9ex]"
								>
									<template v-if="showImages">
										<img
											v-if="
												showAnswers
													? imageTable.links?.[row]?.[column]?.answer ||
													  imageTable.uploads?.[row]?.[column]?.answer
													: imageTable.links?.[row]?.[column]?.question ||
													  imageTable.uploads?.[row]?.[column]?.question
											"
											:src="
												showAnswers
													? imageTable.links?.[row]?.[column]?.answer ||
													  imageTable.uploads?.[row]?.[column]?.answer
													: imageTable.links?.[row]?.[column]?.question ||
													  imageTable.uploads?.[row]?.[column]?.question
											"
											class="h-full object-contain"
										/>

										<Icon
											v-else
											icon="material-symbols:no-photography"
											class="scale-125"
										/>
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
			</div>
		</Transition>
	</li>
</template>

<style scoped lang="postcss">
.item {
	@apply flex items-center justify-center overflow-hidden bg-white/20 text-center;
}

.item p {
	@apply line-clamp-3 w-full break-words;
}
</style>
