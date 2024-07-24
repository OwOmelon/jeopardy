import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { type RowID, type ColumnID, useTemplateStore } from "./template";
import { type Guest, useGuestsStore } from "./guests";

export type AnswerResult = {
	success: Guest["id"] | null;
	fail: Guest["id"][];
};

type GameProgress = Record<RowID, Record<ColumnID, AnswerResult>>;

export const useGameProgressStore = defineStore("game-progress", () => {
	const template = useTemplateStore();
	const guests = useGuestsStore();

	const progress = ref<GameProgress>(fetchGameProgressFromLocalStorage() || {});
	const resetGameProgressWarning = ref<boolean>(false);

	function updateGameProgress(
		row: RowID,
		column: ColumnID,
		failedToAnswer: GameProgressValue["failedToAnswer"],
		successfullyAnswered: GameProgressValue["successfullyAnswered"],
	) {
		const progressRow = progress.value?.[row] ?? {};

		progressRow[column] = {
			failedToAnswer,
			successfullyAnswered,
		};

		progress.value[row] = progressRow;
	}

	function updateGuestsLegitimatePoints(): void {
		guests.list.forEach((guest) => {
			guest.points.legitimate = 0;
		});

		const gameProgressRows = Object.keys(progress.value) as RowID[];

		gameProgressRows.forEach((row) => {
			const pointsToAssign = template.rows[row];
			const gameProgressColumns = Object.keys(
				progress.value[row],
			) as ColumnID[];

			gameProgressColumns.forEach((column) => {
				const gameProgressValue = progress.value[row][column];

				gameProgressValue.failedToAnswer.forEach((id) => {
					guests.editGuestPoints(id, -pointsToAssign, "legitimate", true);
				});

				guests.editGuestPoints(
					gameProgressValue?.successfullyAnswered ?? "guest_",
					pointsToAssign,
					"legitimate",
					true,
				);
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
		updateGameProgress,
	};
});
