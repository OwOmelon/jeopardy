import type {
	RowID,
	Rows,
	ColumnID,
	Columns,
	Table,
	TemplateData,
} from "@/stores/template";
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

		const checkRows = checkHeaders(template.rows, "row");
		const checkColumns = checkHeaders(template.columns, "column");

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

		const rowIDs = Object.keys(template.rows) as RowID[];
		const columnIDs = Object.keys(template.columns) as ColumnID[];

		const textTableAltered = checkTableForErrors(
			"textTable",
			template.textTable,
			rowIDs,
			columnIDs,
		);
		const uploadImageTableAltered = checkTableForErrors(
			"imageTable.uploads",
			template.imageTable.uploads,
			rowIDs,
			columnIDs,
		);
		const linkImageTableAltered = checkTableForErrors(
			"imageTable.links",
			template.imageTable.links,
			rowIDs,
			columnIDs,
		);

		await Promise.allSettled([
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

/*async function checkRowsForErrors(rows: Rows): Promise<string> {
	return new Promise((res, rej) => {
		if (!(typeof rows === "object" && rows !== null && !Array.isArray(rows))) {
			rej({ columns: `template property "rows" is not of type "object"` });

			return;
		}

		const errorsFound: string[] = [];
		const rowEntries = Object.entries(rows) as [RowID, number][];
		const shouldHaveProperties = Array.from(
			{ length: 5 },
			(_, i) => `row${i + 1}`,
		);
		const missingProperties = shouldHaveProperties.filter(
			(id) => rowEntries.findIndex((entry) => entry[0] === id) === -1,
		);

		if (missingProperties.length) {
			errorsFound.push(
				`missing propert${missingProperties.length > 1 ? "ies" : "y"}: ${stringifyArray(
					missingProperties,
				)}`,
			);
		}

		rowEntries.forEach(([id, points]) => {
			if (typeof id === "string" && id.startsWith("row")) {
				const tag = parseInt(id.slice(3, id.length));

				if (!(tag > 0 && tag < 6)) {
					errorsFound.push(
						`number tag of id "${id}" is (${
							tag < 1 ? "below 1" : "above 5"
						}) invalid`,
					);
				}
			} else {
				errorsFound.push(`contains invalid property: "${id}"`);
			}

			if (typeof points !== "number") {
				errorsFound.push(
					`value of property "${id} is not of type "number": ${points}, type ${typeof points}`,
				);
			}
		});

		if (errorsFound.length) {
			rej({ columns: errorsFound });
		} else {
			res("rows pass");
		}
	});
}*/

async function checkHeaders(
	headers: Rows | Columns,
	type: "row" | "column",
): Promise<string> {
	return new Promise((res, rej) => {
		if (
			!(
				typeof headers === "object" &&
				headers !== null &&
				!Array.isArray(headers)
			)
		) {
			rej({ [`${type}s`]: `not of type "object"` });

			return;
		}

		const errorsFound: string[] = [];
		const headerEntries = Object.entries(headers) as [
			string,
			string | number,
		][];
		const shouldHaveProperties = Array.from(
			{ length: 5 },
			(_, i) => `${type}${i + 1}`,
		);
		const missingProperties = shouldHaveProperties.filter(
			(id) => headerEntries.findIndex((entry) => entry[0] === id) === -1,
		);

		if (missingProperties.length) {
			errorsFound.push(
				`missing propert${missingProperties.length > 1 ? "ies" : "y"}: ${stringifyArray(
					missingProperties,
				)}`,
			);
		}

		headerEntries.forEach(([id, value]) => {
			const valueType = type === "row" ? "number" : "string";

			if (typeof id === "string" && id.startsWith(type)) {
				const tag = parseInt(id.slice(type.length, id.length));

				if (!(tag > 0 && tag < 6)) {
					errorsFound.push(
						`number tag of id "${id}" is (${
							tag < 1 ? "below 1" : "above 5"
						}) invalid`,
					);
				}
			} else {
				errorsFound.push(`contains invalid property: "${id}"`);
			}

			if (typeof value !== valueType) {
				errorsFound.push(
					`value of property "${id}" is not of type "${valueType}": ${value}, type ${typeof value}`,
				);
			}
		});

		if (errorsFound.length) {
			rej({ [`${type}s`]: errorsFound });
		} else {
			res("rows pass");
		}
	});
}

// ------------------------------

/*async function checkColumnsForErrors(columns: Columns): Promise<string> {
	return new Promise((res, rej) => {
		if (!Array.isArray(columns)) {
			rej({ columns: `not of type "array"` });

			return;
		}

		const errorsFound: string[] = [];
		const columnEntries = Object.entries(columns) as [RowID, number][];
		const shouldHaveProperties = Array.from(
			{ length: 5 },
			(_, i) => `column${i + 1}`,
		);
		const missingProperties = shouldHaveProperties.filter(
			(id) => columnEntries.findIndex((entry) => entry[0] === id) === -1,
		);

		if (missingProperties.length) {
			errorsFound.push(
				`missing propert${missingProperties.length > 1 ? "ies" : "y"}: ${stringifyArray(
					missingProperties,
				)}`,
			);
		}
	});
}*/

// ------------------------------

function checkTableForErrors(
	name: string,
	table: Table,
	rows: RowID[],
	columns: ColumnID[],
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

			const tableColumns = Object.keys(table[tableRow]) as ColumnID[];

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
