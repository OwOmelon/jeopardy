import type { RowID, Column, Table, TemplateData } from "@/stores/template";

export async function checkTemplateForAlterations(
	template: TemplateData,
): Promise<string> {
	return new Promise(async (res, rej) => {
		const rejectionReasons: string[][] = [];

		// --- STAGE 1

		await checkTemplatePropertiesForErrors(template).catch((err) => {
			rejectionReasons.push(err);
		});

		if (rejectionReasons.length) {
			rej(rejectionReasons);

			return;
		}

		// --- STAGE 2

		if (typeof template.name !== "string") {
			rejectionReasons.push([
				`template property 'name' is not of type 'string'`,
			]);
		}

		const checkRows = checkRowsForErrors(template.rows);
		const checkColumns = checkColumnsForErrors(template.columns);

		await Promise.allSettled([checkRows, checkColumns]).then((values) => {
			values.forEach((value) => {
				if (value.status === "rejected") {
					rejectionReasons.push(value.reason);
				}
			});
		});

		if (rejectionReasons.length) {
			rej(rejectionReasons);

			return;
		}

		// --- STAGE 3

		const columnIDs = template.columns.map((column) => column.id);

		const pointsAltered = checkPointsForErrors(template.points);
		const textTableAltered = checkTableForErrors(
			"textTable",
			template.textTable,
			template.rows,
			columnIDs,
		);
		const uploadImageTableAltered = checkTableForErrors(
			"imageTable.uploads",
			template.imageTable.uploads,
			template.rows,
			columnIDs,
		);
		const linkImageTableAltered = checkTableForErrors(
			"imageTable.links",
			template.imageTable.links,
			template.rows,
			columnIDs,
		);

		await Promise.allSettled([
			pointsAltered,
			textTableAltered,
			uploadImageTableAltered,
			linkImageTableAltered,
		]).then((values) => {
			values.forEach((value) => {
				if (value.status === "rejected") {
					rejectionReasons.push(value.reason);
				}
			});
		});

		console.log(rejectionReasons);

		res("okie :> :3 <3");

		if (rejectionReasons.length) {
			rej(rejectionReasons);
		} else {
			res("template is ok to use");
		}
	});
}

// ------------------------------

async function checkTemplatePropertiesForErrors(
	template: TemplateData,
): Promise<string> {
	return new Promise((res, rej) => {
		const templateProperties = Object.keys(template);
		const shouldHaveProperties = [
			"name",
			"rows",
			"points",
			"columns",
			"textTable",
			"imageTable",
		];

		if (
			templateProperties.length === shouldHaveProperties.length &&
			templateProperties.every((prop) => shouldHaveProperties.includes(prop))
		) {
			res("template properties pass");
		} else {
			rej(["invalid template property was found"]);
		}
	});
}

// ------------------------------

async function checkRowsForErrors(rows: RowID[]): Promise<string> {
	return new Promise((res, rej) => {
		if (!Array.isArray(rows)) {
			rej([`template property 'rows' is not of type 'array'`]);

			return;
		}

		const evaluation: string[] = [];
		const duplicates: RowID[] = [];
		const alteredLength = rows.length - 5;
		const shouldHave = ["row1", "row2", "row3", "row4", "row5"] as const;

		shouldHave.forEach((shouldHaveRow) => {
			if (!rows.includes(shouldHaveRow)) {
				evaluation.push(
					`template property 'rows' is missing id '${shouldHaveRow}'`,
				);
			}
		});

		if (alteredLength !== 0) {
			evaluation.push(
				`template property 'rows' has ${Math.abs(alteredLength)} ${
					alteredLength > 0 ? "more" : "less"
				} items than it should have`,
			);
		}

		rows.forEach((row, index) => {
			if (typeof row === "string" && row.startsWith("row")) {
				const isDuplicate = rows.indexOf(row) !== index;
				const tag = parseInt(row.slice(3, row.length));

				if (isDuplicate) duplicates.push(row);

				if (!(tag > 0 && tag < 6)) {
					evaluation.push(
						`number tag of id '${row}' is (${
							tag < 1 ? "below 1" : "above 5"
						}) invalid`,
					);
				}
			} else {
				evaluation.push(`id at rows[${index}] is invalid`);
			}
		});

		if (duplicates.length) {
			evaluation.unshift(
				`template property 'rows' has ${
					rows.filter((row) => duplicates.includes(row)).length
				} identical ids`,
			);
		}

		if (evaluation.length) {
			rej(evaluation);
		} else {
			res(`rows pass`);
		}
	});
}

// ------------------------------

async function checkColumnsForErrors(columns: Column[]): Promise<string> {
	return new Promise((res, rej) => {
		const evaluation: string[] = [];
		const shouldHave = [
			"column1",
			"column2",
			"column3",
			"column4",
			"column5",
		] as const;
		const duplicates: Column["id"][] = [];
		const alteredLength = columns.length - 5;

		shouldHave.forEach((shouldHaveColumnID) => {
			if (
				columns.findIndex((column) => column.id === shouldHaveColumnID) === -1
			) {
				evaluation.push(
					`template property 'columns' is missing an object with id '${shouldHaveColumnID}'`,
				);
			}
		});

		if (!Array.isArray(columns)) {
			evaluation.push("template property 'columns' is not of type 'array'");

			rej(evaluation);
			return;
		}

		if (alteredLength !== 0) {
			evaluation.push(
				`columns array has ${alteredLength > 0 ? "more" : "less"} ${Math.abs(
					alteredLength,
				)} objects than it should have`,
			);
		}

		columns.forEach((column, index) => {
			const columnCheck = checkColumnForErrors(column, index, columns);

			if (columnCheck.errors.length) {
				columnCheck.errors.forEach((error) => {
					evaluation.push(error);
				});
			}

			if (columnCheck.duplicateIndex) {
				duplicates.push(column.id);
			}
		});

		if (duplicates.length) {
			evaluation.unshift(
				`template property 'columns' has ${
					columns.filter((column) => duplicates.includes(column.id)).length
				} objects with identical ids`,
			);
		}

		if (evaluation.length) {
			rej(evaluation);
		} else {
			res("columns pass");
		}
	});
}

function checkColumnForErrors(
	column: Column,
	index: number,
	columns: Column[],
): { errors: string[]; duplicateIndex: boolean } {
	const evaluation: ReturnType<typeof checkColumnForErrors> = {
		errors: [],
		duplicateIndex: false,
	};

	if (
		!(typeof column === "object" && column !== null && !Array.isArray(column))
	) {
		evaluation.errors.push(`columns[${index}] is not of type 'object'`);

		return evaluation;
	}

	if (column.id !== undefined) {
		if (typeof column.id === "string" && column.id.startsWith("column")) {
			const tag = parseInt(column.id.slice(6, column.id.length));
			const isDuplicate =
				columns.findIndex((c) => c.id === column.id) !== index;

			if (!(tag > 0 && tag < 6)) {
				evaluation.errors.push(
					`number tag of id '${column.id}' is (${
						tag < 0 ? "below 0" : "above 5"
					}) invalid`,
				);
			}

			if (isDuplicate) {
				evaluation.duplicateIndex = true;
			}
		} else {
			evaluation.errors.push(`property 'id' of columns[${index}] is invalid`);
		}
	} else {
		evaluation.errors.push(
			`object at columns[${index}] has missing property 'id'`,
		);
	}

	if (column.category !== undefined) {
		if (typeof column.category !== "string") {
			evaluation.errors.push(
				`property 'category' of columns[${index}] is not of type string`,
			);
		}
	} else {
		evaluation.errors.push(
			`object at columns[${index}] has missing property 'category'`,
		);
	}

	const unncecessaryProperties = Object.keys(column).filter(
		(key) => !["id", "category"].includes(key),
	);

	if (unncecessaryProperties.length) {
		evaluation.errors.push(
			`object at columns[${index}] contains unncecessary propert${
				unncecessaryProperties.length > 1 ? "ies" : "y"
			} (${unncecessaryProperties})`,
		);
	}

	return evaluation;
}

// ------------------------------

async function checkPointsForErrors(points: number[]): Promise<string> {
	return new Promise((res, rej) => {
		const evaluation: string[] = [];

		if (!Array.isArray(points)) {
			evaluation.push(`template property 'points' is not an array`);

			rej(evaluation);
			return;
		}

		const alteredLength = points.length - 5;

		if (alteredLength !== 0) {
			evaluation.push(
				`'points' array has ${alteredLength > 0 ? "more" : "less"} ${Math.abs(
					alteredLength,
				)} items than it should have`,
			);
		}

		points.forEach((num, index) => {
			if (typeof num !== "number") {
				evaluation.push(`item at points[${index}] is not of type 'number'`);
			}
		});

		if (evaluation.length) {
			rej(evaluation);

			return;
		}

		res("points pass");
	});
}

// ------------------------------

function checkTableForErrors(
	name: string,
	table: Table,
	rows: RowID[],
	columns: Column["id"][],
): Promise<string> {
	return new Promise((res, rej) => {
		const notAnObject = !(
			typeof table === "object" &&
			table !== null &&
			!Array.isArray(table)
		);
		const evaluation: string[] = [];

		if (notAnObject) {
			evaluation.push(`template property '${name}' is not of type 'object'`);

			rej(evaluation);
			return;
		}

		const tableRows = Object.keys(table) as RowID[];

		tableRows.forEach((tableRow) => {
			if (!rows.includes(tableRow)) {
				evaluation.push(`${name} has invalid property key: ${tableRow}`);

				return;
			}

			const tableColumns = Object.keys(table[tableRow]) as Column["id"][];

			tableColumns.forEach((tableColumn) => {
				if (!columns.includes(tableColumn)) {
					evaluation.push(
						`${tableRow} of ${name} has invalid property key: ${tableColumn} of row: ${tableRow}`,
					);

					return;
				}

				const cell = table[tableRow][tableColumn];
				const cellEntries = Object.entries(cell);

				if (cellEntries.length !== 2) {
					evaluation.push(
						`cell of ${tableColumn} of ${tableRow} has ${
							cellEntries.length > 2 ? "exceeding" : "deceeding"
						} amount of entries`,
					);
				}

				cellEntries.forEach(([key, value]) => {
					if (!["question", "answer"].includes(key)) {
						evaluation.push(
							`cell of ${tableColumn} of ${tableRow} has invalid key: ${key}`,
						);
					}

					if (typeof value !== "string")
						evaluation.push(
							`value of cell of ${tableColumn} of ${tableRow} is not of type 'string'`,
						);
				});
			});
		});

		if (evaluation.length) {
			rej(evaluation);
		} else {
			res("table pass");
		}
	});
}
