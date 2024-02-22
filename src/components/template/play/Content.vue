<script setup lang="ts">
import { computed, provide } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useGameProgressStore } from "@/stores/game_progress";

import type {
	RowID,
	ColumnID,
	Columns,
	CompleteTable,
} from "@/stores/template";

import Table from "./Table.vue";
import EmptyTable_PlayFallback from "./EmptyTableFallback.vue";
import TableDataReveal from "./td_reveal/TableDataReveal.vue";
import GuestList from "@/components/guests/GuestList.vue";
import WarningModal from "@/components/WarningModal.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";

const template = useTemplateStore();
const gameProgress = useGameProgressStore();

const filteredColumns = computed<Columns>(() => {
	const columnEntries = Object.entries(template.columns) as [
		ColumnID,
		string,
	][];
	const filteredColumnEntries = columnEntries.filter(([column, category]) => {
		return category || !template.columnIsEmpty(column);
	});

	return Object.fromEntries(filteredColumnEntries);
});

const filteredCompleteTable = computed<CompleteTable>(() => {
	const rowEntries = Object.entries(template.rows) as [RowID, number][];
	const filteredColumnEntries = Object.entries(filteredColumns.value) as [
		ColumnID,
		string,
	][];

	return rowEntries.reduce((allRowEntries, [row, points]) => {
		return {
			...allRowEntries,
			[row]: filteredColumnEntries.reduce(
				(allColumnEntries, [column, category]) => {
					return {
						...allColumnEntries,
						[column]: template.completeTable[row][column],
					};
				},
				{},
			),
		};
	}, {});
});

provide('filtered-columns', filteredColumns)
provide('filtered-complete-table', filteredCompleteTable)
</script>

<template>
	<div>
		<Table v-if="Object.keys(filteredColumns).length" />
		<EmptyTable_PlayFallback v-else />

		<GuestList />

		<ModalWrapper :show="template.activeCell ? true : false">
			<TableDataReveal />
		</ModalWrapper>

		<ModalWrapper :show="gameProgress.resetGameProgressWarning">
			<WarningModal
				header="!! PROGRESS RESET"
				:paragraph="[
					'Are you sure you want to reset your play progress?',
					`Your progress as well as every guests' score will be reset. This action cannot be undone.`,
				]"
				@confirm="gameProgress.progress = {}"
				@close="gameProgress.resetGameProgressWarning = false"
			/>
		</ModalWrapper>
	</div>
</template>
