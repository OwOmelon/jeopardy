<script setup lang="ts">
import type { Columns } from "@/stores/template";

const props = defineProps<{
	columns: Columns
}>()
</script>

<template>
	<tr class="items-end">
		<th
			v-for="(category, column, index) in columns"
			class="cell cell-width cell-padding bg-red-400 text-white"
		>
			{{ category || column }}
		</th>
	</tr>
</template>
