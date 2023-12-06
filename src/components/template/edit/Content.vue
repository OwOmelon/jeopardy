<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";
import { useGameProgressStore } from "@/stores/game_progress";

import Table from './Table.vue'
import ExternalTemplateHandling from './ExternalTemplateHandling.vue'
import TableDataEditor from "./table_data_editor/TableDataEditor.vue";
import WarningModal from "@/components/WarningModal.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";

const template = useTemplateStore();
const gameProgress = useGameProgressStore();
</script>

<template>
	<div>
		<Table />
		<ExternalTemplateHandling />

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
	</div>
</template>

<style scoped lang="postcss">
.table-wrapper {
	@apply pt-8
}
</style>