import type { RowID, Column, Table, TemplateData } from "@/stores/template";

export async function checkTemplateForAlterations(
	template: TemplateData,
): Promise<string> {
	return new Promise(async (res, rej) => {
		const rejectionReasons: string[][] = [];

		// --- STAGE 1

		await checkTemplatePropertiesForAlterations(template).catch((err) => {
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

		const pointsAltered = checkPointsForAlterations(template.points);
		const textTableAltered = checkTableForAlterations(
			"textTable",
			template.textTable,
			template.rows,
			columnIDs,
		);
		const uploadImageTableAltered = checkTableForAlterations(
			"imageTable.uploads",
			template.imageTable.uploads,
			template.rows,
			columnIDs,
		);
		const linkImageTableAltered = checkTableForAlterations(
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

		if (rejectionReasons.length) {
			rej(rejectionReasons);
		} else {
			res("template is ok to use");
		}
	});
}

// ------------------------------

async function checkTemplatePropertiesForAlterations(
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

		const errorsFound: string[] = [];
		const duplicates: RowID[] = [];

		const alteredLength = rows.length - 5;

		if (alteredLength !== 0) {
			errorsFound.push(
				`template property 'rows' has ${Math.abs(alteredLength)} ${
					alteredLength > 0 ? "more" : "less"
				} items than it should have`,
			);
		}

		rows.forEach((row, index) => {
			if (typeof row === "string") {
				if (row.startsWith("row")) {
					const isDuplicate = rows.indexOf(row) !== index;
					const tag = parseInt(row.slice(3, row.length));

					if (isDuplicate) duplicates.push(row);

					if (!(tag > 0 && tag < 6)) {
						errorsFound.push(
							`number tag of id '${row}' is (${
								tag < 1 ? "below 1" : "above 5"
							}) invalid`,
						);
					}
				} else {
					errorsFound.push(`id at rows[${index}] is invalid (${row})`);
				}
			} else {
				errorsFound.push(`id at rows[${index}] is not of type 'string'`);
			}
		});

		if (duplicates.length) {
			errorsFound.unshift(
				`template property 'rows' has ${
					rows.filter((row) => duplicates.includes(row)).length
				} identical ids`,
			);
		}

		if (errorsFound.length) {
			rej(errorsFound);
		} else {
			res(`rows pass`);
		}
	});
}

// ------------------------------

async function checkColumnsForErrors(columns: Column[]): Promise<string> {
	return new Promise((res, rej) => {
		const errorsFound: string[] = [];

		if (!Array.isArray(columns)) {
			errorsFound.push("template property 'columns' is not of type 'array'");

			rej(errorsFound);
			return;
		}

		const duplicates: Column["id"][] = [];

		const alteredLength = columns.length - 5;

		if (alteredLength !== 0) {
			errorsFound.push(
				`columns array has ${alteredLength > 0 ? "more" : "less"} ${Math.abs(
					alteredLength,
				)} objects than it should have`,
			);
		}

		columns.forEach((column, index) => {
			const columnCheck = checkColumnForErrors(column, index, columns);

			if (columnCheck.errors.length) {
				columnCheck.errors.forEach((error) => {
					errorsFound.push(error);
				});
			}

			if (columnCheck.duplicateIndex) {
				duplicates.push(column.id);
			}
		});

		if (duplicates.length) {
			errorsFound.unshift(
				`template property 'columns' has ${
					columns.filter((column) => duplicates.includes(column.id)).length
				} objects with identical ids`,
			);
		}

		if (errorsFound.length) {
			rej(errorsFound);
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

	if (column.id) {
		if (typeof column.id === "string") {
			if (column.id.startsWith("column")) {
				const tag = parseInt(column.id.slice(6, column.id.length));
				const isDuplicate =
					columns.findIndex((c) => c.id === column.id) !== index;

				if (!(tag > 0 && tag < 6)) {
					evaluation.errors.push(
						`tag (${tag}) of id '${column.id}' is (${
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
				`property 'id' of columns[${index}] is not of type string`,
			);
		}
	} else {
		evaluation.errors.push(
			`object at columns[${index}] has missing property 'id'`,
		);
	}

	if (column.category) {
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

	const unncecessaryProperties: any[] = [];

	Object.keys(column).forEach((key) => {
		if (!["id", "category"].includes(key)) {
			unncecessaryProperties.push(key);
		}
	});

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

async function checkPointsForAlterations(points: number[]): Promise<string> {
	return new Promise((res, rej) => {
		const errorsFound: string[] = [];

		if (!Array.isArray(points)) {
			errorsFound.push(`template property 'points' is not an array`);

			rej(errorsFound);
			return;
		}

		const alteredLength = points.length - 5;

		if (alteredLength !== 0) {
			errorsFound.push(
				`'points' array has ${alteredLength > 0 ? "more" : "less"} ${Math.abs(
					alteredLength,
				)} items than it should have`,
			);
		}

		points.forEach((num, index) => {
			if (typeof num !== "number") {
				errorsFound.push(`item at points[${index}] is not of type 'number'`);
			}
		});

		if (errorsFound.length) {
			rej(errorsFound);

			return;
		}

		res("points pass");
	});
}

// ------------------------------

function checkTableForAlterations(
	name: string,
	table: Table,
	rows: RowID[],
	columns: Column["id"][],
): Promise<string> {
	return new Promise((res, rej) => {
		const errorsFound: string[] = [];

		if (
			!(typeof table === "object" && table !== null && !Array.isArray(table))
		) {
			errorsFound.push(`template property '${name}' is not of type 'object'`);

			rej(errorsFound);
			return;
		}

		const tableRows = Object.keys(table) as RowID[];

		tableRows.forEach((tableRow) => {
			if (!rows.includes(tableRow)) {
				errorsFound.push(`${name} has invalid property key: ${tableRow}`);

				return;
			}

			const tableColumns = Object.keys(table[tableRow]) as Column["id"][];

			tableColumns.forEach((tableColumn) => {
				if (!columns.includes(tableColumn)) {
					errorsFound.push(
						`${tableRow} of ${name} has invalid property key: ${tableColumn} of row: ${tableRow}`,
					);

					return;
				}

				const cell = table[tableRow][tableColumn];
				const cellEntries = Object.entries(cell);

				if (cellEntries.length !== 2) {
					errorsFound.push(
						`cell of ${tableColumn} of ${tableRow} has ${
							cellEntries.length > 2 ? "exceeding" : "deceeding"
						} amount of entries`,
					);
				}

				cellEntries.forEach(([key, value]) => {
					if (!["question", "answer"].includes(key)) {
						errorsFound.push(
							`cell of ${tableColumn} of ${tableRow} has invalid key: ${key}`,
						);
					}

					if (typeof value !== "string")
						errorsFound.push(
							`value of cell of  ${tableColumn} of ${tableRow} is not of type 'string'`,
						);
				});
			});
		});

		if (errorsFound.length) {
			rej(errorsFound);
		} else {
			res("table pass");
		}
	});
}
