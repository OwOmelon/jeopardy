<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";

const template = useTemplateStore();
</script>

<template>
	<div class="flex flex-col gap-3">
		<p>you template is empty D:</p>
		<button type="button" @click="template.editing = true">
			go work on it
		</button>
	</div>
</template>
