import { ref, computed, watch } from "vue";
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
    const guestLimit = 6;

    return list.value.length < guestLimit ? false : true;
  });

  function addGuest(name: string): void {
    if (guestLimitReached.value) return;

    const newGuest: Guest = {
      id: uuidv4(),
      name: name,
      points: 0,
    };

    list.value.push(newGuest);
  }

  function deleteGuest(id: string): void {
    if (activeGuestID.value === id) {
      activeGuestID.value = "";
    }
    list.value = list.value.filter((guest) => guest.id !== id);
  }

  function editGuestName(id: string, newName: string): void {
    const guest = getGuest(id);

    if (!guest) return;

    guest.name = newName;
  }

  function editGuestPoints(id: string, newPoints: number, add: boolean = false): void {
    const guest = getGuest(id);

    if (!guest) return;

    guest.points = (add ? guest.points : 0) + newPoints;
  }

  function getGuest(id: string): Guest | null {
    const guestIndex = list.value.findIndex((guest) => guest.id === id);

    return list.value[guestIndex] ?? null;
  };

  function fetchGuestListFromLocalStorage(): Guest[] {
    const list = localStorage.getItem("guestList");

    return list ? JSON.parse(list) : [];
  };

  watch(
    list,
    (guestList) => {
      localStorage.setItem("guestList", JSON.stringify(guestList));
    },
    { deep: true },
  );

  list.value = fetchGuestListFromLocalStorage();

  return {
    list,
    activeGuestID,
    guestLimitReached,

    // ----

    addGuest,
    editGuestName,
    editGuestPoints,
    deleteGuest,
    getGuest,
  };
});
