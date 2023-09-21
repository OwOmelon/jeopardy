import { ref, computed, onBeforeMount } from "vue";
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export type Player = {
  id: string;
  name: string;
  points: number;
};

export const usePlayersStore = defineStore("players", () => {
  const players = ref<Player[]>([]);
  const activePlayerID = ref<string>("");

  const playerLimitReached = computed<boolean>(() => {
    const playerLimit = 6;

    return players.value.length <= playerLimit ? false : true;
  });

  function addPlayer(name: string): void {
    const newPlayer: Player = {
      id: uuidv4(),
      name: name,
      points: 0,
    };

    players.value.push(newPlayer);
  }

  function editPlayerName(id: string, newName: string): void {
    const playerIndex = players.value.findIndex((player) => player.id === id);

    if (playerIndex === -1) return;

    players.value[playerIndex].name = newName;
  }

  function deletePlayer(id: string): void {
    if (activePlayerID.value === id) {
      activePlayerID.value = "";
    }
    players.value = players.value.filter((player) => player.id !== id);
  }

  return {
    players,
    activePlayerID,
    playerLimitReached,

    // ----

    addPlayer,
    editPlayerName,
    deletePlayer,
  };
});
