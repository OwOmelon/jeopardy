import { ref, onMounted } from "vue";

export function useCustomStylesheet(id: string) {
	const stylesheet = ref<HTMLStyleElement | null>(null);

	function write(css: string): void {
		if (stylesheet.value === null) {
			console.error("stylesheet not found");

			return;
		}

		stylesheet.value.innerText = css;
	}

	onMounted(() => {
		// short for stylesheet
		const ss = document.createElement("style");
		const attr = "custom-stylesheet";

		ss.setAttribute(attr, id);
		ss.disabled = false;

		document.head.appendChild(ss);

		stylesheet.value = document.querySelector(`[${attr}=${id}]`);
	});

	return { write };
}
