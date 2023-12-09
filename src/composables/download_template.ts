import type { TemplateData } from "@/stores/template";

export function downloadTemplate(template: TemplateData): void {
	const file = new Blob([JSON.stringify(template, null, 3)], {
		type: "application/json",
	});

	const a = document.createElement("a");
	const url = URL.createObjectURL(file);

	a.href = url;
	a.download = template.name || "Jeopardy Template";

	document.body.appendChild(a);

	a.click();

	setTimeout(() => {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 0);
}
