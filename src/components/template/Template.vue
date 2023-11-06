<script setup lang="ts">
import { ref, computed } from "vue";
import { useTemplateStore } from "@/stores/template";

import TemplateName from "./TemplateName.vue";
import Table_Edit from "./edit/Table.vue";
import Table_Play from "./play/Table.vue";
import EmptyTable_PlayFallback from "./play/EmptyTableFallback.vue";
import GuestList from "../guests/GuestList.vue";

const template = useTemplateStore();
</script>

<template>
	<div class="mt-10 w-full">
		<TemplateName />

		<div class="grid place-items-center overflow-auto p-8">
			<Transition
				:name="template.editing ? 'fade-slide-right' : 'fade-slide-left'"
				mode="out-in"
			>
				<Table_Edit v-if="template.editing" />

				<template v-else>
					<Table_Play v-if="template.filteredColumns.length" />
					<EmptyTable_PlayFallback v-else />
				</template>
			</Transition>
		</div>

		<Transition name="height-auto">
			<div v-if="!template.editing" class="grid">
				<GuestList />
			</div>
		</Transition>
	</div>
</template>

<style scoped lang="postcss">
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
