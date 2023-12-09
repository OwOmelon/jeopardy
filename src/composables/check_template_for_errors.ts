import type { RowID, Column, Table, TemplateData } from "@/stores/template";
export type TemplateErrors = { [key: string]: string[] };

export async function checkTemplateForErrors(
	template: TemplateData,
): Promise<string> {
	return new Promise(async (res, rej) => {
		const errorsFound: TemplateErrors = {};
		const errorWasFound = () =>
			Object.keys(errorsFound).length ? true : false;

		// --- STAGE 1

		await checkTemplatePropertiesForErrors(template).catch((err) => {
			errorsFound.template = [err];
		});

		if (errorWasFound()) {
			rej(errorsFound);

			return;
		}

		// --- STAGE 2

		if (typeof template.name !== "string") {
			errorsFound.name = [`template property "name" is not of type "string"`];
		}

		const checkRows = checkRowsForErrors(template.rows);
		const checkColumns = checkColumnsForErrors(template.columns);

		await Promise.allSettled([checkRows, checkColumns]).then((values) => {
			values.forEach((value) => {
				if (value.status === "rejected") {
					const [property, errors] = Object.entries(value.reason)[0] as [
						string,
						string[],
					];

					errorsFound[property] = errors;
				}
			});
		});

		if (errorWasFound()) {
			rej(errorsFound);

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
					const [property, errors] = Object.entries(value.reason)[0] as [
						string,
						string[],
					];

					errorsFound[property] = errors;
				}
			});
		});

		if (errorWasFound()) {
			rej(errorsFound);
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
		const missingProperties = [
			"name",
			"rows",
			"points",
			"columns",
			"textTable",
			"imageTable",
		].filter((prop) => !templateProperties.includes(prop));

		if (missingProperties.length) {
			rej({
				template: `missing propeties: ${stringifyArray(missingProperties)}`,
			});
		} else {
			res("template propeties pass");
		}
	});
}

// ------------------------------

async function checkRowsForErrors(rows: RowID[]): Promise<string> {
	return new Promise((res, rej) => {
		if (!Array.isArray(rows)) {
			rej({ rows: [`not of type "array"`] });

			return;
		}

		const evaluation: string[] = [];
		const duplicates: RowID[] = [];
		const alteredLength = rows.length - 5;
		const missingIDs = ["row1", "row2", "row3", "row4", "row5"].filter(
			(id) => !rows.includes(id as RowID),
		);

		if (missingIDs.length) {
			evaluation.push(
				`missing id${missingIDs.length > 1 ? "s" : ""}: ${stringifyArray(
					missingIDs,
				)}`,
			);
		}

		if (alteredLength !== 0) {
			evaluation.push(
				`has ${Math.abs(alteredLength)} ${
					alteredLength > 0 ? "more" : "less"
				} item${alteredLength > 1 ? "s" : ""} than it should have`,
			);
		}

		rows.forEach((row, index) => {
			if (typeof row === "string" && row.startsWith("row")) {
				const isDuplicate = rows.indexOf(row) !== index;
				const tag = parseInt(row.slice(3, row.length));

				if (isDuplicate) duplicates.push(row);

				if (!(tag > 0 && tag < 6)) {
					evaluation.push(
						`number tag of id "${row}" is (${
							tag < 1 ? "below 1" : "above 5"
						}) invalid`,
					);
				}
			} else {
				evaluation.push(`id at index ${index} is invalid`);
			}
		});

		if (duplicates.length) {
			evaluation.splice(
				1,
				0,
				`has ${
					rows.filter((row) => duplicates.includes(row)).length
				} identical ids`,
			);
		}

		if (evaluation.length) {
			rej({ rows: evaluation });
		} else {
			res(`rows pass`);
		}
	});
}

// ------------------------------

async function checkColumnsForErrors(columns: Column[]): Promise<string> {
	return new Promise((res, rej) => {
		if (!Array.isArray(columns)) {
			rej({ columns: `not of type "array"` });

			return;
		}

		const evaluation: string[] = [];
		const duplicates: Column["id"][] = [];
		const alteredLength = columns.length - 5;
		const missingIDs = [
			"column1",
			"column2",
			"column3",
			"column4",
			"column5",
		].filter((id) => columns.findIndex((column) => column.id === id) === -1);

		if (missingIDs.length) {
			const plural = missingIDs.length > 1 ? "s" : "";

			evaluation.unshift(
				`missing object${plural} with id${plural}: ${stringifyArray(
					missingIDs,
				)}`,
			);
		}

		if (alteredLength !== 0) {
			evaluation.push(
				`has ${alteredLength > 0 ? "more" : "less"} ${Math.abs(
					alteredLength,
				)} item${alteredLength > 1 ? "s" : ""} than it should have`,
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
				`contains ${
					columns.filter((column) => duplicates.includes(column.id)).length
				} objects with identical ids`,
			);
		}

		if (evaluation.length) {
			rej({ columns: evaluation });
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
		evaluation.errors.push(`item at index ${index} is not of type "object"`);

		return evaluation;
	}

	if (column.id !== undefined) {
		if (typeof column.id === "string" && column.id.startsWith("column")) {
			const tag = parseInt(column.id.slice(6, column.id.length));
			const isDuplicate =
				columns.findIndex((c) => c.id === column.id) !== index;

			if (!(tag > 0 && tag < 6)) {
				evaluation.errors.push(
					`number tag of id "${column.id}" is (${
						tag < 0 ? "below 0" : "above 5"
					}) invalid`,
				);
			}

			if (isDuplicate) {
				evaluation.duplicateIndex = true;
			}
		} else {
			evaluation.errors.push(
				`property "id" of object at index ${index} is invalid`,
			);
		}
	} else {
		evaluation.errors.push(`object at index ${index} is missing property "id"`);
	}

	if (column.category !== undefined) {
		if (typeof column.category !== "string") {
			evaluation.errors.push(
				`property "category" of object at index ${index} is not of type "string"`,
			);
		}
	} else {
		evaluation.errors.push(
			`object at index ${index} is missing property "category"`,
		);
	}

	const unncecessaryProperties = Object.keys(column).filter(
		(key) => !["id", "category"].includes(key),
	);

	if (unncecessaryProperties.length) {
		evaluation.errors.push(
			`object at index ${index} contains unncecessary propert${
				unncecessaryProperties.length > 1 ? "ies" : "y"
			} ${stringifyArray(unncecessaryProperties)}`,
		);
	}

	return evaluation;
}

// ------------------------------

async function checkPointsForErrors(points: number[]): Promise<string> {
	return new Promise((res, rej) => {
		const evaluation: string[] = [];

		if (!Array.isArray(points)) {
			evaluation.push(`not an array`);

			rej(evaluation);
			return;
		}

		const alteredLength = points.length - 5;

		if (alteredLength !== 0) {
			evaluation.push(
				`has ${Math.abs(alteredLength)} ${
					alteredLength > 0 ? "more" : "less"
				} item${alteredLength > 1 ? "s" : ""} than it should have`,
			);
		}

		points.forEach((num, index) => {
			if (typeof num !== "number") {
				evaluation.push(`item at index ${index} is not of type "number"`);
			}
		});

		if (evaluation.length) {
			rej({ points: evaluation });
		} else {
			res("points pass");
		}
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
			evaluation.push(`not of type "object"`);

			rej({ [name]: evaluation });
			return;
		}

		const tableRows = Object.keys(table) as RowID[];

		tableRows.forEach((tableRow) => {
			if (!rows.includes(tableRow)) {
				evaluation.push(`contains unnecessary property: ${tableRow}`);

				return;
			}

			const tableColumns = Object.keys(table[tableRow]) as Column["id"][];

			tableColumns.forEach((tableColumn) => {
				if (!columns.includes(tableColumn)) {
					evaluation.push(
						`${tableRow} contains unnecessary property: (${tableColumn})`,
					);

					return;
				}

				const cell = table[tableRow][tableColumn];
				const cellEntries = Object.entries(cell);

				cellEntries.forEach(([key, value]) => {
					if (key === "question" || key === "answer") {
						if (typeof value !== "string") {
							evaluation.push(
								`${key} property of object ${tableColumn} of ${tableRow} is not of type "string"`,
							);
						}
					}
				});
			});
		});

		if (evaluation.length) {
			rej({ [name]: evaluation });
		} else {
			res("table pass");
		}
	});
}

function stringifyArray(array: any[]): string {
	return JSON.stringify(array).replaceAll(",", ", ");
}
