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

	function addImage(
		src: string,
		type: "question" | "answer",
		row: RowID,
		column: Column["id"],
	) {
		const imageRow = images.value?.[row] ?? {};
		const imageCell = imageRow?.[column] ?? { question: "", answer: "" };

		imageCell[type] = src;
		imageRow[column] = imageCell
		images.value[row] = imageRow;
	}

	return {
		images,
		addImage,
	};
});
