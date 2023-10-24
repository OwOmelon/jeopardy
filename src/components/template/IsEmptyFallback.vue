<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";
import { Icon } from "@iconify/vue";

const template = useTemplateStore();
</script>

<template>
	<div class="flex flex-col items-center gap-3">
		<p class="text-3xl font-bold">you template is empty D:</p>
		<button
			type="button"
			class="flex items-center gap-3 rounded bg-red-400 p-3 text-white transition-transform hover:-translate-y-1"
			@click="template.editing = true"
		>
			go work on it
			<Icon icon="material-symbols:edit-rounded" class="h-6 w-6" />
		</button>
	</div>
</template>
