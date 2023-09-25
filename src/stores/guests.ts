import { ref, computed, onBeforeMount } from "vue";
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export type Guest = {
  id: string;
  name: string;
  points: number;
};

export const useGuestsStore = defineStore("guests", () => {
  const list = ref<Guest[]>([]);
  const activePlayerID = ref<string>("");

  const playerLimitReached = computed<boolean>(() => {
    const playerLimit = 6;

    return list.value.length <= playerLimit ? false : true;
  });

  function addPlayer(name: string): void {
    const newPlayer: Guest = {
      id: uuidv4(),
      name: name,
      points: 0,
    };

    list.value.push(newPlayer);
  }

  function editPlayerName(id: string, newName: string): void {
    const playerIndex = list.value.findIndex((player) => player.id === id);

    if (playerIndex === -1) return;

    list.value[playerIndex].name = newName;
  }

  function deletePlayer(id: string): void {
    if (activePlayerID.value === id) {
      activePlayerID.value = "";
    }
    list.value = list.value.filter((player) => player.id !== id);
  }

  return {
    list,
    activePlayerID,
    playerLimitReached,

    // ----

    addPlayer,
    editPlayerName,
    deletePlayer,
  };
});
