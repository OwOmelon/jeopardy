import { ref } from "vue";

const styleSheetID = "drag-override-window-cursor";
const appCursorOverrideStyleSheet = ref<HTMLStyleElement | null>(null);

export const appCursorOverwrite = { enable, disable };

function enable(cursor: string): void {
	appCursorOverrideStyleSheet.value!.disabled = false;
	appCursorOverrideStyleSheet.value!.innerText = `* { cursor: ${cursor} !important}`;
}

function disable(): void {
	appCursorOverrideStyleSheet.value!.disabled = true;
}

{
	const styleSheet = document.createElement("style");

	styleSheet.disabled = true;
	styleSheet.title = styleSheetID;
	styleSheet.setAttribute("id", styleSheetID);

	document.head.appendChild(styleSheet);

	appCursorOverrideStyleSheet.value = document.getElementById(
		styleSheetID,
	) as HTMLStyleElement;
}
