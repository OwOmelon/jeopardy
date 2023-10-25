<script setup lang="ts">
import { ref, computed } from "vue";
import { useTemplateStore } from "@/stores/template";

import TemplateName from "./TemplateName.vue";
import Table_Edit from "./edit/Table.vue";
import Table_Play from "./play/Table.vue";

const template = useTemplateStore();
</script>

<template>
	<div class="mt-10 w-full">
		<TemplateName />

		<Table_Edit v-if="template.editing" />
		<Table_Play v-else />
	</div>
</template>

<style scoped lang="postcss">
:deep(table) {
	@apply grid w-full overflow-auto p-8
}

:deep(.cell-padding) {
	@apply p-[0.5em];
}
</style>

<style scoped lang="scss">
.slide {
	&-move,
	&-enter-active,
	&-leave-active {
		transition: all 0.25s cubic-bezier(0.55, 0, 0.1, 1);
	}
}

.disabled {
	&-move,
	&-enter-active,
	&-leave-active {
		transition: all 0s;
	}
}
</style>
