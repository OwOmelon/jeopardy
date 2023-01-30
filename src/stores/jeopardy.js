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

	// cell has been answered ? participant.name : false
	const tracker = ref([]);

	// CREATE TABLE
	// for (let i = 0; i < rows.value.length; i++) {
	// 	table.value.push({});

	// 	for (let k = 0; k < columns.value.length; k++) {
	// 		table.value[i][columns.value[k].id] = {
	// 			question: "",
	// 			answer: "",
	// 		};
	// 	}
	// }

	const activeCell = ref({
		row: null,
		column: null,
	});

	const activeCategoryCell = ref(null);

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

		showRestartModal.value = false;
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

		let res = await fetch(`http://localhost:5000/save1?id=1&id=2&id=3`);
		const data = await res.json();

		// console.log(data);

		rows.value = data[0].rows;
		columns.value = data[1].columns;
		table.value = data[2].table;

		loading.value = false;
	}

	async function upddateRows() {
		const newRows = { id: 1, columns: rows.value };
		const res = await fetch(`http://localhost:5000/save1/1`, {
			method: "PUT",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(newRows),
		});
	}

	async function upddateColumns() {
		const newColumns = { id: 2, columns: columns.value };
		const res = await fetch(`http://localhost:5000/save1/2`, {
			method: "PUT",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(newColumns),
		});
	}

	async function updateTable() {
		const newTable = { id: 3, table: table.value };
		const res = await fetch("http://localhost:5000/save1/3", {
			method: "PUT",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(newTable),
		});
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
			upddateColumns();
		},
		{ deep: true }
	);

	watch(
		() => table,
		(x) => {
			console.log("table", x.value);
			updateTable();
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

		createTracker,
		resetProgress,
		resetActiveCell,
		resetTemplate,

		//
	};
});
