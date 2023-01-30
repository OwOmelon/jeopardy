<script setup>
import Editor from "./components/Editor.vue";
import Playing from "./components/Playing.vue";

const jeop = useJeopardyStore();

const views = { Editor, Playing };

function toggleMenu(e) {
	if (
		e.key === "Escape" &&
		jeop.activeCell.column === null &&
		!jeop.showRestartModal
	) {
		jeop.showMenu = true;
	}
}

watch(
	() => jeop.showMenu,
	(state) => {
		if (state === false) {
			window.addEventListener("keydown", toggleMenu);
		} else {
			window.removeEventListener("keydown", toggleMenu);
		}

		if (jeop.showMenuModal) {
			setTimeout(() => {
				jeop.showMenuModal = false;
			}, 3000);
		}
	}
);
</script>

<template>
	<Transition name="fade" leave-active-class="absolute duration-150">
		<component :is="views[jeop.currentView]"></component>
	</Transition>

	<Transition name="fade">
		<MainMenu v-if="jeop.showMenu === true" />
		<EditCell
			v-else-if="
				jeop.activeCell.row !== null && jeop.currentView === jeop.views[0]
			"
		/>
		<RestartModal v-else-if="jeop.showRestartModal" />
		<div
			class="fixed top-[3vh] bg-neutral-300 px-4 py-2 rounded drop-shadow-2xl/ index-50"
			v-else-if="jeop.showMenuModal && !jeop.showMenu"
		>
			<p>just press ESC to open up the menu whenever</p>
		</div>
	</Transition>
</template>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
	transition: opacity 150ms;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

/* SLOW FADE ////////////////////// */

.slow-fade-enter-active,
.slow-fade-leave-active {
	transition: opacity 1000ms;
}

.slow-fade-enter-from,
.slow-fade-leave-to {
	opacity: 0;
}

/* SLIDE LEFT ////////////////////// */

.slide-left-enter-active,
.slide-left-leave-active {
	transition: all 0.25s ease-out;
}

.slide-left-leave-active {
	position: absolute;
}

.slide-left-enter-from {
	opacity: 0;
	transform: translateX(50px);
}

.slide-left-leave-to {
	opacity: 0;
	transform: translateX(-50px);
}

/* SLIDE RIGHT ////////////////////// */

.slide-right-enter-active,
.slide-right-leave-active {
	transition: all 0.25s ease-out;
}

.slide-right-leave-active {
	position: absolute;
}

.slide-right-enter-from {
	opacity: 0;
	transform: translateX(-50px);
}

.slide-right-leave-to {
	opacity: 0;
	transform: translateX(50px);
}

// /////////////////////////

.on-focus {
	border-bottom-width: 2px;
	border-color: transparent;

	outline: none;

	&:focus {
		border-color: #f87171;
	}
}
</style>
