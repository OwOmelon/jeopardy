<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";

const template = useTemplateStore();
</script>

<template>
	<table class="flex w-[900px] flex-col gap-5">
		<tr class="items-end">
			<th v-for="category in template.columns" class="bg-red-400 text-white rounded p-2 shadow shadow-black/30">
				{{ category.name || category.id }}
			</th>
		</tr>

		<tr v-for="row in template.tableDisplay">
			<td v-for="cell in row" class="grid place-items-center bg-stone-300 text-lg">
				<span>{{ cell.points }}</span>
			</td>
		</tr>
	</table>
</template>

<style scoped lang="postcss">
tr {
	@apply grid grid-cols-5 gap-5;
}
</style>
