import { ref } from "vue";

const cursor = ref<HTMLElement | null>(null);
const enteredDropZone = ref<boolean>(false);

function move(x: number, y: number, animate: boolean) {
	cursor.value!.animate(
		{
			transform: `translate(${x}px, ${y}px)`,
		},
		{ duration: animate ? 1000 : 0, fill: "forwards" },
	);
}

function show() {
	cursor.value!.style.opacity = "1";
}

function hide() {
	cursor.value!.style.transform = "";
	cursor.value!.style.opacity = "0";
}

setTimeout(() => {
	cursor.value = document.getElementById("drag-cursor");
	hide();

	window.addEventListener("keydown", (e) => {
		if (e.ctrlKey && e.shiftKey && e.altKey && e.code === "KeyD") {
			enteredDropZone.value = !enteredDropZone.value;
		}
	});
}, 100);

export function useDragCursor() {
	return {
		enteredDropZone,
		move,
		show,
		hide,
	};
}
