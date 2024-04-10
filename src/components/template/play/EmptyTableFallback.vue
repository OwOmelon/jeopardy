<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";
import IconEdit from "~icons/material-symbols/edit-rounded";

const template = useTemplateStore();
</script>

<template>
	<div class="mx-auto my-10 w-fit rounded bg-stone-50 p-5 shadow-md">
		<p class="text-xl font-bold text-stone-600">your table is empty D:</p>
		<button
			type="button"
			class="mx-auto mt-5 flex items-center gap-2 rounded bg-red-400 p-2 text-sm text-white shadow transition-transform hover:-translate-y-1"
			@click="template.editing = true"
		>
			go work on it

			<IconEdit class="h-6 w-6" />
		</button>
	</div>
</template>
