<script setup lang="ts">
import { ref } from "vue";
import { useTemplateStore } from "@/stores/template";
import { downloadTemplate } from "@/composables/download_template";
import { checkTemplateForErrors } from "@/composables/check_template_for_errors";

import type { TemplateErrors } from "@/composables/check_template_for_errors";

import IconReset from "~icons/ph/arrow-counter-clockwise-bold";
import IconUpload from "~icons/material-symbols/upload-rounded";
import IconDownload from "~icons/material-symbols/download-rounded";

const emit = defineEmits<{
	"reset-template": [];
	"import-error-read": [Error];
	"import-error-properties": [TemplateErrors];
}>();

const template = useTemplateStore();

const importTemplateBtn = ref<HTMLInputElement | null>(null);

async function importTemplate(): Promise<void> {
	const file = importTemplateBtn.value!.files![0];

	try {
		const parsedImporttedTemplate = await parseJSONFile(file);

		try {
			await checkTemplateForErrors(parsedImporttedTemplate);

			template.setTemplateData(parsedImporttedTemplate);
		} catch (err) {
			emit("import-error-properties", err as TemplateErrors);
		}
	} catch (err) {
		emit("import-error-read", err as Error);
	}

	importTemplateBtn.value!.value = "";
}

function parseJSONFile(file: any): Promise<any> {
	return new Promise((res, rej) => {
		const reader = new FileReader();

		reader.onload = (ev) => {
			try {
				res(JSON.parse(ev.target!.result as string));
			} catch (err) {
				rej(err);
			}
		};

		reader.onerror = (err) => {
			rej(err);
		};

		reader.readAsText(file);
	});
}
</script>

<template>
	<div class="mx-8">
		<div
			class="col-start-2 row-start-3 mx-auto grid max-w-[964px] grid-cols-3 gap-x-3"
		>
			<hr
				class="col-start-1 col-end-4 my-3 rounded-full border-t-2 border-stone-600"
			/>

			<button
				type="button"
				class="cell-padding"
				@click="emit('reset-template')"
			>
				reset

				<IconReset />
			</button>

			<label class="cell-padding cursor-pointer">
				<span class="block text-center">import</span>
				<input
					ref="importTemplateBtn"
					type="file"
					class="hidden"
					@change="importTemplate"
				/>

				<IconUpload />
			</label>

			<button
				type="button"
				class="cell-padding"
				@click="downloadTemplate(template.getTemplateData())"
			>
				download

				<IconDownload />
			</button>
		</div>
	</div>
</template>

<style scoped lang="postcss">
button,
label {
	@apply shadow-subtle row-start-2 flex items-center justify-center gap-2 rounded border-2 border-transparent bg-red-400 text-xl font-semibold text-white outline-none transition-[border-color,_transform] hover:-translate-y-1 focus:border-red-400 active:scale-95;
}
</style>
