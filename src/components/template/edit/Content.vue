<script setup lang="ts">
import { ref } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useGameProgressStore } from "@/stores/game_progress";

import type { TemplateErrors } from "@/composables/check_template_for_errors";

import Table from "./Table.vue";
import ExternalTemplateHandling from "./ExternalTemplateHandling.vue";
import TableDataEditor from "./table_data_editor/TableDataEditor.vue";
import TemplatePropertyErrorAlert from "../TemplatePropertyErrorAlert.vue";
import WarningModal from "@/components/WarningModal.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";

const template = useTemplateStore();
const gameProgress = useGameProgressStore();

const resetTemplateWarning = ref<boolean>(false);
const importTemplateError_Properties = ref<TemplateErrors | null>(null);
const importTemplateError_Read = ref<Error | null>(null);
</script>

<template>
	<div>
		<Table />
		<ExternalTemplateHandling
			@reset-template="resetTemplateWarning = true"
			@import-error-properties="importTemplateError_Properties = $event"
			@import-error-read="importTemplateError_Read = $event"
		/>

		<ModalWrapper :show="template.activeTableDataCell ? true : false">
			<TableDataEditor />
		</ModalWrapper>

		<ModalWrapper :show="resetTemplateWarning">
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
						
						template.setTemplateData(template.createTemplateData());
					}
				"
				@close="resetTemplateWarning = false"
			/>
		</ModalWrapper>

		<ModalWrapper :show="importTemplateError_Properties !== null">
			<TemplatePropertyErrorAlert
				header="!! IMPORT TEMPLATE ERROR"
				:paragraph="['Errors were found in the template you tried to import.']"
				:errors="importTemplateError_Properties!"
				@close="importTemplateError_Properties = null"
			/>
		</ModalWrapper>

		<ModalWrapper :show="importTemplateError_Read !== null">
			<WarningModal
				header="!! IMPORT TEMPLATE ERROR"
				:paragraph="['Error reading file.']"
				hide-confirm-btn
				@close="importTemplateError_Read = null"
			>
				<span>
					{{ importTemplateError_Read }}
				</span>
			</WarningModal>
		</ModalWrapper>
	</div>
</template>

<style scoped lang="postcss">
.table-wrapper {
	@apply pt-8;
}
</style>
