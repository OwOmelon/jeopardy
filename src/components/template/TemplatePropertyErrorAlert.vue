<script setup lang="ts">
import type { TemplateErrors } from "@/composables/check_template_for_errors";

import WarningModal from "../WarningModal.vue";

const props = defineProps<{
	header: string;
	paragraph: string[];
	errors: TemplateErrors;
}>();

const emit = defineEmits<{
	close: [];
}>();
</script>

<template>
	<WarningModal
		:header="header"
		:paragraph="paragraph"
		hide-confirm-btn
		@close="emit('close')"
	>
		<div v-for="(errorList, property, index) in errors" :key="property">
			<span class="font-bold tracking-wide">{{ property }}: </span>
			<ol class="ml-8 list-disc">
				<li v-for="error in errorList">{{ error }}</li>
			</ol>
		</div>

		<slot />
	</WarningModal>
</template>
