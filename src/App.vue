<script setup lang="ts">
import { watch } from "vue";
import { useTemplateStore } from "./stores/template";
import { useMainMenuStore } from "./stores/mainmenu";

import MainMenu from "./components/MainMenuModal/Menu.vue";
import PauseBtn from "./components/MainMenuModal/PauseBtn.vue";
import JeopardyTemplate from "./components/template/Template.vue";
import ModalWrapper from "./components/ModalWrapper.vue";
import TemplateHistory from "./components/template_history/History.vue";
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
		body.className = is ? "bg-stone-800" : "bg-stone-100";
	},
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
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;600;800&display=swap");

*,
*::before,
*::after {
	@apply m-0 box-border p-0;
}

body {
	@apply bg-stone-800 font-["Poppins",_sans-serrif] text-sm text-stone-500 transition-colors lg:text-base;
}

#app {
	@apply flex min-h-screen flex-col items-center justify-center py-10;
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
		opacity: 1;
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
		opacity: 1;
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

.nested-fade-slide-down {
	&-enter-active,
	&-leave-active {
		transition: all 300ms ease-in-out;
	}

	&-enter-from,
	&-leave-to {
		opacity: 0;
	}

	&-enter-active .component,
	&-leave-active .component {
		transition: all 300ms ease-in-out;
	}

	&-enter-from .component,
	&-leave-to .component {
		transform: translateY(-15px);
		opacity: 0.001;
	}
}

.height-auto {
	&-enter-active,
	&-leave-active {
		transition:
			grid-template-rows 300ms,
			opacity 300ms;
	}

	&-enter-from,
	&-leave-to {
		grid-template-rows: 0fr;
		opacity: 0;
	}

	&-enter-to,
	&-leave-from {
		grid-template-rows: 1fr;
	}
}

.breathe {
	animation: breathe 1s ease-in-out infinite;
}

@keyframes breathe {
	0%,
	100% {
		transform: scale(1);
	}

	50% {
		transform: scale(1.05);
	}
}
</style>
