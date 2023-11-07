<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";

import RowPoints from "./RowPoints.vue";
import RowCategories from "./RowCategories.vue";
import RowHRs from "./RowHRs.vue";
import TableData from "./TableData.vue";
import TableDataEditor from "./TableDataEditor.vue";
import WarningModal from "@/components/WarningModal.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";

const template = useTemplateStore();
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
						:data-values="template.checkTableDataValues(rowKey, cellKey)"
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
					'Your template history will be wiped upon doing so.',
				]"
				@confirm="
					() => {
						template.history = [];
						template.historyPushIteration = 0;
						template.templateData = template.createTemplate();
					}
				"
				@close="template.resetTemplateWarning = false"
			/>
		</ModalWrapper>
	</table>
</template>

<style scoped lang="postcss">
:deep(.th-bg) {
	@apply bg-stone-500 text-stone-100;
}
</style>
