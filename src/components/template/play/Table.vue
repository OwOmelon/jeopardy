<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";

const template = useTemplateStore();
</script>

<template>
	<div>
		<h1 class="template-name">{{template.name}}</h1>
	</div>
</template>