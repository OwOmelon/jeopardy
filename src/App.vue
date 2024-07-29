<script setup lang="ts">
import { watch } from "vue";
import { useTemplateStore } from "./stores/template";
import { useMainMenuStore } from "./stores/mainmenu";

import MainMenu from "./components/main_menu/Menu.vue";
import PauseBtn from "./components/main_menu/PauseBtn.vue";
import JeopardyTemplate from "./components/template/Template.vue";
import ModalWrapper from "./components/ModalWrapper.vue";
import TemplateHistory from "./components/template/history/History.vue";
import DragCursor from "./components/template/edit/draggable/DragCrusor.vue";

const template = useTemplateStore();
const mainmenu = useMainMenuStore();
const body = document.getElementsByTagName("body")[0];
const initialDocumentTitle = document.title;

watch(
	() => template.name,
	(name) => {
		document.title = name || initialDocumentTitle;
	},
);

watch(
	() => template.editing,
	(is) => {
		body.className = is ? "bg-stone-800" : "bg-stone-200";
	},
	{ immediate: true },
);

watch(
	() => template.activeTableDataCell,
	(data) => {
		body.style.overflow = data === null ? "" : "hidden";
	},
);
</script>

<template>
	<PauseBtn />
	<TemplateHistory v-if="template.editing" />

	<JeopardyTemplate />

	<ModalWrapper :show="mainmenu.show">
		<MainMenu />
	</ModalWrapper>

	<DragCursor />
</template>

<style lang="postcss">
#app {
	@apply flex min-h-screen flex-col items-center justify-center pb-10 pt-16;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

input[type="number"] {
	-moz-appearance: textfield;
}

.th:has(.textbox:focus) {
	@apply -translate-y-2 scale-110 !cursor-text;
}
</style>

<style lang="scss">
.fade {
	&-enter-active,
	&-leave-active {
		transition: opacity 150ms;
	}

	&-enter-from,
	&-leave-to {
		opacity: 0;
	}
}

.fade-slide-left {
	&-enter-active {
		transition:
			opacity 150ms ease-out,
			transform 150ms ease-out;
	}

	&-leave-active {
		transition:
			opacity 150ms ease-in,
			transform 150ms ease-in;
	}

	&-enter-from {
		opacity: 0;
		transform: translateX(15px);
	}

	&-leave-to {
		opacity: 0;
		transform: translateX(-15px);
	}
}

.fade-slide-right {
	&-enter-active {
		transition:
			opacity 150ms ease-out,
			transform 150ms ease-out;
	}

	&-leave-active {
		transition:
			opacity 150ms ease-in,
			transform 150ms ease-in;
	}

	&-enter-from {
		opacity: 0;
		transform: translateX(-15px);
	}

	&-leave-to {
		opacity: 0;
		transform: translateX(15px);
	}
}

.fade-slide-down {
	&-enter-active,
	&-leave-active {
		transition:
			opacity 150ms,
			transform 150ms;
	}

	&-enter-from,
	&-leave-to {
		opacity: 0;
	}

	&-enter-from {
		transform: translateY(-15px);
	}

	&-leave-to {
		transform: translateY(15px);
	}
}

.list-slide-left {
	&-move,
	&-enter-active,
	&-leave-active {
		transition: all 150ms cubic-bezier(0.55, 0, 0.1, 1);
	}

	&-leave-active {
		position: absolute;
	}

	&-enter-from {
		opacity: 0;
		transform: translateX(25px);
	}

	&-leave-to {
		opacity: 0;
		transform: translateX(-25px);
	}
}
</style>
