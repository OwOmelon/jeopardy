<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";

import TemplateName from "./TemplateName.vue";
import Content_Edit from "./edit/Content.vue";
import Content_Play from "./play/Content.vue";

const template = useTemplateStore();
</script>

<template>
	<div class="w-full mt-10/">
		<TemplateName />
		<Transition
			:name="template.editing ? 'fade-slide-right' : 'fade-slide-left'"
			mode="out-in"
		>
			<Content_Edit v-if="template.editing" />
			<Content_Play v-else />
		</Transition>
	</div>
</template>

<style scoped lang="postcss">
:deep(.table-wrapper) {
	@apply grid w-full place-items-center overflow-auto px-8;
}

:deep(tr) {
	@apply flex gap-3;
}

:deep(td) {
	@apply h-[9.5ex] cursor-pointer text-xs;
}

:deep(.td-rise) {
	@apply hover:-translate-y-2 hover:scale-105 hover:shadow-lg;
}

:deep(.cell) {
	@apply rounded border-2 border-transparent shadow !shadow-black/30 transition-[background-color,_border_color,_color,_box-shadow,_opacity,_transform];
}

:deep(.cell-width) {
	@apply w-[140px];
}

:deep(.cell-padding) {
	@apply p-[0.5em];
}
</style>
