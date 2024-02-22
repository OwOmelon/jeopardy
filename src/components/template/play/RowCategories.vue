<script setup lang="ts">
import { inject } from "vue";
import type { Columns } from "@/stores/template";

const columns = inject('filtered-columns') as Columns
</script>

<template>
	<tr class="tr-flex items-end">
		<th
			v-for="(category, column, index) in columns"
			class="cell cell-width cell-padding bg-red-400 text-white"
		>
			{{ category || column }}
		</th>
	</tr>
</template>
