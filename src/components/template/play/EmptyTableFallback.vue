<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";
import { Icon } from "@iconify/vue";

const template = useTemplateStore();
</script>

<template>
	<div class="my-10 rounded bg-stone-50 p-3 shadow-md w-fit mx-auto">
		<p class="text-xl font-bold">your table is empty D:</p>
		<button
			type="button"
			class="mx-auto mt-5 flex items-center gap-2 rounded bg-red-400 p-2 text-sm text-white shadow transition-transform hover:-translate-y-1"
			@click="template.editing = true"
		>
			go work on it
			<Icon icon="material-symbols:edit-rounded" class="h-6 w-6" />
		</button>
	</div>
</template>