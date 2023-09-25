<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";

const template = useTemplateStore();
</script>

<template>
	<table class="flex w-[900px] flex-col gap-5">
		<tr class="items-end">
			<th
				v-for="category in template.columns"
				class="rounded bg-red-400 p-2 text-white shadow shadow-black/30"
			>
				{{ category.name || category.id }}
			</th>
		</tr>

		<tr v-for="(rowValue, rowKey, rowIndex) in template.tableDisplay">
			<td
				v-for="(cellValue, cellKey, cellIndex) in rowValue"
				:class="[
					{ 'td-missing-data': template.cellHasMissingData(rowKey, cellKey) },
					'grid place-items-center hover:bg-red-400 hover:text-white',
				]"
			>
				<span>{{ cellValue.points }}</span>
			</td>
		</tr>
	</table>
</template>

<style scoped lang="postcss">
tr {
	@apply grid grid-cols-5 gap-5;
}
</style>
