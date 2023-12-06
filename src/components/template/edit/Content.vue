<script setup lang="ts">
import { ref } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useGameProgressStore } from "@/stores/game_progress";

import Table from "./Table.vue";
import ExternalTemplateHandling from "./ExternalTemplateHandling.vue";
import TableDataEditor from "./table_data_editor/TableDataEditor.vue";
import WarningModal from "@/components/WarningModal.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";

const template = useTemplateStore();
const gameProgress = useGameProgressStore();

const resetTemplateWarning = ref<boolean>(false);
</script>

<template>
	<div>
		<Table />
		<ExternalTemplateHandling @reset-template="resetTemplateWarning = true" />

		<ModalWrapper :show="template.activeCell ? true : false">
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
						template.templateData = template.createTemplate();
					}
				"
				@close="resetTemplateWarning = false"
			/>
		</ModalWrapper>
	</div>
</template>

<style scoped lang="postcss">
.table-wrapper {
	@apply pt-8;
}
</style>
