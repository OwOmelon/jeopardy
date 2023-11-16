import { defineStore } from "pinia";
import { ref } from "vue";

import type { RowID, Column } from "./template";

export type UploadedImages = {
	[key: RowID]: {
		[key: Column["id"]]: {
			question: string;
			answer: string;
		};
	};
};

export const useUploadedImagesStore = defineStore("uploaded-images", () => {
	const images = ref<UploadedImages>({});

	return {
		images,
	};
});
