<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTemplateStore } from "@/stores/template";
import { useGameProgressStore } from "@/stores/game_progress";

import RowCategories from "./RowCategories.vue";
import TableData from "./TableData.vue";
import TableDataReveal from "./td_reveal/TableDataReveal.vue";
import WarningModal from "@/components/WarningModal.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";

const {
	activeCell: activeTemplateCell,
	filteredCompleteTable: filteredTemplateCompleteTable,
} = storeToRefs(useTemplateStore());

const { checkTableDataProperties: checkTemplateTableDataProperties } =
	useTemplateStore();

const { progress: gameProgress, resetGameProgressWarning } = storeToRefs(
	useGameProgressStore(),
);
</script>

<template>
	<table class="grid gap-3">
		<RowCategories />

		<tr
			v-for="(rowValue, rowKey, rowIndex) in filteredTemplateCompleteTable"
			:key="rowKey"
		>
			<TableData
				v-for="(cellValue, cellKey, cellIndex) in rowValue"
				v-bind="cellValue"
				:is-empty="
					checkTemplateTableDataProperties(rowKey, cellKey) === 'empty'
				"
				:key="cellKey"
				@reveal="activeTemplateCell = cellValue"
			/>
		</tr>

		<ModalWrapper :show="activeTemplateCell ? true : false">
			<TableDataReveal />
		</ModalWrapper>

		<ModalWrapper :show="resetGameProgressWarning">
			<WarningModal
				header="!! PROGRESS RESET"
				:paragraph="[
					'Are you sure you want to reset your play progress?',
					`Your progress as well as every guests' score will be reset. This action cannot be undone.`,
				]"
				@confirm="
					() => {
						gameProgress = {};
					}
				"
				@close="resetGameProgressWarning = false"
			/>
		</ModalWrapper>
	</table>
</template>
