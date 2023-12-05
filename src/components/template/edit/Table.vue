<script setup lang="ts">
import { ref } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useGameProgressStore } from "@/stores/game_progress";
import { checkTemplateForAlterations } from "@/composables/check_template_for_alterations";

import type { RowID, Column, Table, TemplateData } from "@/stores/template";

import RowPoints from "./RowPoints.vue";
import RowCategories from "./RowCategories.vue";
import RowHRs from "./RowHRs.vue";
import TableData from "./TableData.vue";
import TableDataEditor from "./table_data_editor/TableDataEditor.vue";
import WarningModal from "@/components/WarningModal.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";

const template = useTemplateStore();
const gameProgress = useGameProgressStore();

const importButton = ref<HTMLInputElement | null>(null);
const importtedTemplateWarning = ref(false);

function downloadTemplate(): void {
	const file = new Blob([JSON.stringify(template.templateData, null, 3)], {
		type: "application/json",
	});

	const a = document.createElement("a");
	const url = URL.createObjectURL(file);

	a.href = url;
	a.download = template.templateData.name || "Jeopardy Template";

	document.body.appendChild(a);

	a.click();

	setTimeout(() => {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 0);
}

async function importTemplate(e: any): Promise<void> {
	const file = e.target!.files[0];

	try {
		const parsedImporttedTemplate = await parseJSONFile(file);

		try {
			const templateCheck = await checkTemplateForAlterations(
				parsedImporttedTemplate,
			);

			template.templateData = parsedImporttedTemplate;
		} catch (err) {
			console.log(err);
		}
	} catch (err) {
		console.log("error reading json file");
		console.log(err);
	}

	e.target.value = "";
}

function parseJSONFile(file: any): Promise<any> {
	return new Promise((res, rej) => {
		if (file.type !== "application/json") rej("not json");

		const reader = new FileReader();

		reader.onload = (ev) => {
			res(JSON.parse(ev.target!.result as string));
		};

		reader.onerror = (err) => {
			rej(err);
		};

		reader.readAsText(file);
	});
}
</script>

<template>
	<table class="grid">
		<th class="col-start-2 row-start-1">
			<RowCategories />
			<RowHRs />
		</th>
		<RowPoints />

		<div class="col-start-2 row-start-2 flex flex-col gap-3">
			<TransitionGroup
				tag="tr"
				name="list-slide-left"
				v-for="(rowValue, rowKey, rowIndex) in template.completeTable"
				:key="rowKey"
				class="relative"
			>
				<template
					v-for="(cellValue, cellKey, columnIndex) in rowValue"
					:key="cellKey"
				>
					<TableData
						v-bind="cellValue"
						:data-values="template.checkTableDataProperties(rowKey, cellKey)"
						@edit="template.activeCell = cellValue"
					/>
				</template>
			</TransitionGroup>
		</div>

		<ModalWrapper :show="template.activeCell ? true : false">
			<TableDataEditor />
		</ModalWrapper>

		<ModalWrapper :show="template.resetTemplateWarning">
			<WarningModal
				header="!! TEMPLATE RESET"
				:paragraph="[
					'Are you sure you want to reset your template?',
					'Your template history and play progress will be wiped upon doing so.',
				]"
				@confirm="
					() => {
						gameProgress.progress = {};
						template.history = [];
						template.historyPushIteration = 0;
						template.templateData = template.createTemplate();
					}
				"
				@close="template.resetTemplateWarning = false"
			/>
		</ModalWrapper>

		<div class="col-start-2 row-start-3 grid grid-cols-3 gap-x-3">
			<hr
				class="col-start-1 col-end-4 my-3 rounded-full border-t-2 border-stone-600"
			/>

			<button
				type="button"
				class="cell-padding"
				@click="template.resetTemplateWarning = true"
			>
				reset
			</button>

			<label class="cell-padding cursor-pointer">
				<span class="block text-center">import</span>
				<input
					ref="importButton"
					type="file"
					class="hidden"
					@change="importTemplate"
				/>
			</label>

			<button type="button" class="cell-padding" @click="downloadTemplate">
				download
			</button>
		</div>
	</table>
</template>

<style scoped lang="postcss">
:deep(.th-bg) {
	@apply bg-stone-500 text-stone-100;
}

button,
label {
	@apply row-start-2 rounded border-2 border-transparent bg-stone-100 font-semibold text-stone-600 shadow shadow-black/30 outline-none transition-[border-color,_transform] hover:-translate-y-1 focus:border-red-400 active:scale-95;
}
</style>
