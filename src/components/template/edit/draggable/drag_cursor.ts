import { ref, onMounted } from "vue";

export function useDragCursor() {
	const cursor = ref<HTMLElement | null>(null);

	function move(x: number, y: number, animate: boolean) {
		cursor.value!.animate(
			{
				transform: `translate(${x}px, ${y}px)`,
			},
			{ duration: animate ? 1000 : 0, fill: "forwards" },
		);
	}

	function show() {
		cursor.value!.style.opacity = "100";
	}

	function hide() {
		cursor.value!.style.transform = "";
		// cursor.value!.style.opacity = "0";
	}

	function addClass(className: string) {
		cursor.value!.className = className
	}

	onMounted(() => {
		cursor.value = document.getElementById("drag-cursor");
		hide();
	});

	return {
		move,
		show,
		hide,
		addClass,
	};
}
