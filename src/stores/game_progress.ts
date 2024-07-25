import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { type RowID, type ColumnID, useTemplateStore } from "./template";
import { type Guest, useGuestsStore } from "./guests";

export type AnswerResults = {
	success: Guest["id"] | null;
	fail: Guest["id"][];
};

type GameProgress = Record<RowID, Record<ColumnID, AnswerResults>>;

export const useGameProgressStore = defineStore("game-progress", () => {
	const template = useTemplateStore();
	const guests = useGuestsStore();

	const progress = ref<GameProgress>(fetchGameProgressFromLocalStorage() || {});
	const resetGameProgressWarning = ref<boolean>(false);

	function getAnswerResults(row: RowID, column: ColumnID): AnswerResults {
		return progress.value?.[row]?.[column] ?? { success: null, fail: [] };
	}

	function updateGameProgress(
		row: RowID,
		column: ColumnID,
		answerResult: AnswerResults,
	) {
		const progressRow = progress.value?.[row] ?? {};

		progressRow[column] = answerResult;
		progress.value[row] = progressRow;
	}

	function updateGuestsLegitimatePoints(): void {
		guests.list.forEach((guest) => {
			guest.points.legitimate = 0;
		});

		Object.entries(progress.value).forEach(([row, columns]) => {
			const pointsToAssign = template.rows[row as RowID];

			Object.entries(columns).forEach(([_, answerResults]) => {
				if (answerResults.success) {
					guests.editGuestPoints(
						answerResults?.success,
						pointsToAssign,
						"legitimate",
						true,
					);
				}

				answerResults.fail.forEach((id) => {
					guests.editGuestPoints(id, -pointsToAssign, "legitimate", true);
				});
			});
		});
	}

	watch(
		progress,
		(progress) => {
			updateGuestsLegitimatePoints();
			localStorage.setItem("play-progress", JSON.stringify(progress));
		},
		{ deep: true },
	);

	function fetchGameProgressFromLocalStorage(): GameProgress | null {
		const savedProgress = localStorage.getItem("play-progress");

		return savedProgress ? JSON.parse(savedProgress) : null;
	}

	return {
		progress,
		resetGameProgressWarning,
		getAnswerResults,
		updateGameProgress,
	};
});
