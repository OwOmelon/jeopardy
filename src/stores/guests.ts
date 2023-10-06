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
  const activeGuestID = ref<string>("");

  const guestLimitReached = computed<boolean>(() => {
    const playerLimit = 6;

    return list.value.length < playerLimit ? false : true;
  });

  function addGuest(name: string): void {
    if (guestLimitReached.value) return 

    const newPlayer: Guest = {
      id: uuidv4(),
      name: name,
      points: 0,
    };

    list.value.push(newPlayer);
  }

  function editGuestName(id: string, newName: string): void {
    const playerIndex = list.value.findIndex((guest) => guest.id === id);

    if (playerIndex === -1) return;

    list.value[playerIndex].name = newName;
  }

  function deleteGuest(id: string): void {
    if (activeGuestID.value === id) {
      activeGuestID.value = "";
    }
    list.value = list.value.filter((guest) => guest.id !== id);
  }

  return {
    list,
    activeGuestID,
    guestLimitReached,

    // ----

    addGuest,
    editGuestName,
    deleteGuest,
  };
});
