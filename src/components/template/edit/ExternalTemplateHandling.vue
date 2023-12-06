<script setup lang="ts">
import { ref } from "vue";
import { useTemplateStore } from "@/stores/template";
import { checkTemplateForAlterations } from "@/composables/check_template_for_alterations";

const emit = defineEmits<{
	"reset-template": [];
}>();

const template = useTemplateStore();

const importTemplateBtn = ref<HTMLInputElement | null>(null);

function downloadTemplate(): void {
	const file = new Blob([JSON.stringify(template.templateData, null, 3)], {
		type: "application/json",
	});

	const a = document.createElement("a");
	const url = URL.createObjectURL(file);

	a.href = url;
	a.download = template.templateData.name || "Jeopardy Template";

	document.body.appendChild(a);

	a.click();

	setTimeout(() => {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 0);
}

async function importTemplate(e: any): Promise<void> {
	const file = e.target!.files[0];

	try {
		const parsedImporttedTemplate = await parseJSONFile(file);

		try {
			const templateCheck = await checkTemplateForAlterations(
				parsedImporttedTemplate,
			);

			template.templateData = parsedImporttedTemplate;
		} catch (err) {
			console.log(err);
		}
	} catch (err) {
		console.log("error reading json file");
		console.log(err);
	}

	e.target.value = "";
}

function parseJSONFile(file: any): Promise<any> {
	return new Promise((res, rej) => {
		if (file.type !== "application/json") rej("not json");

		const reader = new FileReader();

		reader.onload = (ev) => {
			res(JSON.parse(ev.target!.result as string));
		};

		reader.onerror = (err) => {
			rej(err);
		};

		reader.readAsText(file);
	});
}
</script>

<template>
	<div
		class="col-start-2 row-start-3 mx-auto grid max-w-[914px] grid-cols-3 gap-x-3 px-8"
	>
		<hr
			class="col-start-1 col-end-4 my-3 rounded-full border-t-2 border-stone-600"
		/>

		<button type="button" class="cell-padding" @click="emit('reset-template')">
			reset
		</button>

		<label class="cell-padding cursor-pointer">
			<span class="block text-center">import</span>
			<input
				ref="importTemplateBtn"
				type="file"
				class="hidden"
				@change="importTemplate"
			/>
		</label>

		<button type="button" class="cell-padding" @click="downloadTemplate">
			download
		</button>
	</div>
</template>

<style scoped lang="postcss">
button,
label {
	@apply row-start-2 rounded border-2 border-transparent bg-stone-100 font-semibold text-stone-600 shadow shadow-black/30 outline-none transition-[border-color,_transform] hover:-translate-y-1 focus:border-red-400 active:scale-95;
}
</style>
