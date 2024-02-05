<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";
import { useGameProgressStore } from "@/stores/game_progress";

import Table from "./Table.vue";
import EmptyTable_PlayFallback from "./EmptyTableFallback.vue";
import TableDataReveal from "./td_reveal/TableDataReveal.vue";
import GuestList from "@/components/guests/GuestList.vue";
import WarningModal from "@/components/WarningModal.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";

const template = useTemplateStore();
const gameProgress = useGameProgressStore();
</script>

<template>
	<div>
		<Table v-if="Object.keys(template.completeTable).length" />
		<EmptyTable_PlayFallback v-else />

		<GuestList />

		<ModalWrapper :show="template.activeCell ? true : false">
			<TableDataReveal />
		</ModalWrapper>

		<ModalWrapper :show="gameProgress.resetGameProgressWarning">
			<WarningModal
				header="!! PROGRESS RESET"
				:paragraph="[
					'Are you sure you want to reset your play progress?',
					`Your progress as well as every guests' score will be reset. This action cannot be undone.`,
				]"
				@confirm="gameProgress.progress = {}"
				@close="gameProgress.resetGameProgressWarning = false"
			/>
		</ModalWrapper>
	</div>
</template>
