export const useJeopardyStore = defineStore("jeopardy", () => {
	const views = ["Editor", "Playing"];
	const currentView = ref(views[0]);
	const showMenu = ref(true);
	const showMenuModal = ref(true);
	const showRestartModal = ref(false);
	const loading = ref(false);

	const rows = ref();
	const columns = ref();
	const table = ref();
	const participants = ref([]);

	// keeps track of which cell(s) have been answered or not.
	// cell has been answered ? participant.name : false
	const tracker = ref([]);

	const activeCell = ref({
		row: null,
		column: null,
	});

	const activeCategoryCell = ref(null);

	const gameOngoing = computed(() => {
		let array = [];
		for (let i = 0; i < tracker.value.length; i++) {
			const row = tracker.value[i].every((state) => state === false);
			array.push(row);
		}

		return !array.every((state) => state === true);
	});

	function createTracker() {
		let array = [];
		for (let i = 0; i < rows.value.length; i++) {
			array.push([]);

			for (let k = 0; k < columns.value.length; k++) {
				array[i].push(false);
			}
		}

		tracker.value = array;
	}

	function resetActiveCell() {
		activeCell.value.row = null;
		activeCell.value.column = null;
	}

	function resetProgress() {
		createTracker();
		participants.value.forEach((participant) => {
			participant.points = 0;
		});
	}

	function resetTemplate() {
		for (let i = 0; i < table.valuelength; i++) {
			for (let k = 0; k < columns.value.length; k++) {
				table.value[i][jeop.columns[k].id].question = "";
				table.value[i][jeop.columns[k].id].answer = "";
			}
		}

		columns.value.forEach((column) => {
			column.name = column.id;
		});
	}

	async function fetchJeopardy() {
		loading.value = true;

		if (
			JSON.parse(localStorage.getItem("rows")) === null &&
			JSON.parse(localStorage.getItem("columns")) === null &&
			JSON.parse(localStorage.getItem("table")) === null
		) {
			let rows = [];
			let columns = [];
			let table = [];

			// CREATE ROWS AND COLUMNS
			for (let i = 0; i < 5; i++) {
				rows.push(100 * (i + 1));
				columns.push({ id: `column${i + 1}`, name: `column${i + 1}` });
			}

			// CREATE TABLE
			for (let row = 0; row < rows.length; row++) {
				table.push({});

				for (let column = 0; column < columns.length; column++) {
					table[row][columns[column].id] = {
						question: "",
						answer: "",
					};
				}
			}

			localStorage.setItem("rows", JSON.stringify(rows));
			localStorage.setItem("columns", JSON.stringify(columns));
			localStorage.setItem("table", JSON.stringify(table));
		}
		rows.value = JSON.parse(localStorage.getItem("rows"));
		columns.value = JSON.parse(localStorage.getItem("columns"));
		table.value = JSON.parse(localStorage.getItem("table"));

		loading.value = false;
	}

	watch(
		() => rows,
		(x) => {
			console.log("rows", x.value);
		},
		{ deep: true }
	);

	watch(
		() => columns,
		(x) => {
			console.log("columns", x.value);
			localStorage.setItem("columns", JSON.stringify(columns.value));
		},
		{ deep: true }
	);

	watch(
		() => table,
		(x) => {
			console.log("table", x.value);
			localStorage.setItem("table", JSON.stringify(table.value));
		},
		{ deep: true }
	);

	fetchJeopardy();

	return {
		views,
		currentView,
		showMenu,
		showMenuModal,
		showRestartModal,
		loading,

		rows,
		columns,
		table,
		participants,
		tracker,
		activeCell,
		activeCategoryCell,
		gameOngoing,

		createTracker,
		resetProgress,
		resetActiveCell,
		resetTemplate,

		//
	};
});
