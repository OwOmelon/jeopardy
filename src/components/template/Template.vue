<script setup lang="ts">
import { ref } from "vue";
import { useTemplateStore } from "@/stores/template";
import { downloadTemplate } from "@/composables/download_template";

import IconCheck from "~icons/material-symbols/check-small";
import TemplateName from "./TemplateName.vue";
import Content_Edit from "./edit/Content.vue";
import Content_Play from "./play/Content.vue";
import ModalWrapper from "../ModalWrapper.vue";
import TemplatePropertyErrorAlert from "./TemplatePropertyErrorAlert.vue";

const template = useTemplateStore();
const downloadLocalStorageTemplate = ref<boolean>(false);

function onTemplatePropertyErrorAlertClose(): void {
	const localStorageTemplate = template.fetchTemplateFromLocalStorage();

	template.localStorageTemplateErrors = null;
	template.setTemplateData(template.createTemplateData());

	if (downloadLocalStorageTemplate.value && localStorageTemplate) {
		downloadTemplate(localStorageTemplate);
	}
}
</script>

<template>
	<div class="w-full">
		<TemplateName />
		<Transition
			:name="template.editing ? 'fade-slide-right' : 'fade-slide-left'"
			mode="out-in"
		>
			<Content_Edit v-if="template.editing" />
			<Content_Play v-else />
		</Transition>

		<ModalWrapper :show="template.localStorageTemplateErrors !== null">
			<TemplatePropertyErrorAlert
				header="!! LOCAL STORAGE TEMPLATE ERROR"
				:paragraph="[
					'Errors have been found in your local storage template.',
					'The only way this could have happened is that it was manually tampered with.',
					'Your Jeopardy template will be reset once this window closes.',
				]"
				:errors="template.localStorageTemplateErrors!"
				@close="onTemplatePropertyErrorAlertClose"
			>
				<label class="flex cursor-pointer items-center gap-3">
					<input
						v-model="downloadLocalStorageTemplate"
						type="checkbox"
						class="fixed top-full hidden"
					/>

					<div
						:class="[
							downloadLocalStorageTemplate ? 'bg-white' : 'bg-red-400',
							'shadow-subtle aspect-square w-8 rounded border-2 border-white',
						]"
					>
						<IconCheck
							:class="[
								{ hidden: !downloadLocalStorageTemplate },
								'h-full w-full scale-125 text-red-400',
							]"
						/>
					</div>

					<span class="tracking wide font-bold"
						>download local storage template</span
					>
				</label>
			</TemplatePropertyErrorAlert>
		</ModalWrapper>
	</div>
</template>

<style scoped lang="postcss">
:deep(.table-wrapper) {
	@apply grid w-full place-items-center overflow-auto p-8;
}

:deep(.tr-flex) {
	@apply flex gap-3;
}

:deep(th) {
	@apply text-xl
}

:deep(.td-stylized) {
	@apply h-[9.5ex] cursor-pointer text-xs;
}

:deep(.td-rise) {
	@apply hover:-translate-y-2 hover:scale-105 hover:shadow-lg;
}

:deep(.cell) {
	@apply break-words rounded border-2 border-transparent shadow !shadow-black/30 transition-[background-color,_border_color,_color,_box-shadow,_opacity,_transform] focus-within:border-stone-100;
}

:deep(.cell-width) {
	@apply w-[160px];
}

:deep(.cell-padding) {
	@apply p-[0.5em];
}
</style>
