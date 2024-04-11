import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export type Guest = {
	id: string;
	name: string;
	points: {
		legitimate: number /* POINTS EARNED THROUGH ANSWERING CELLS */;
		illegitimate: number /* MANUALLY ADDED POINTS */;
	};
};

export type ActiveGuestID = Guest["id"] | null;

export const useGuestsStore = defineStore("guests", () => {
	const list = ref<Guest[]>(fetchGuestListFromLocalStorage());
	const activeGuestID = ref<ActiveGuestID>(null);

	const guestLimitReached = computed<boolean>(() => {
		const guestLimit = 6;

		return list.value.length < guestLimit ? false : true;
	});

	function addGuest(name: string): void {
		if (guestLimitReached.value) return;

		const newGuest: Guest = {
			id: uuidv4(),
			name: name,
			points: {
				legitimate: 0,
				illegitimate: 0,
			},
		};

		list.value.push(newGuest);
	}

	function deleteGuest(id: Guest["id"]): void {
		if (activeGuestID.value === id) resetActiveGuestID();

		list.value = list.value.filter((guest) => guest.id !== id);
	}

	function editGuestName(id: Guest["id"], newName: string): void {
		const guest = getGuest(id);

		if (!guest) return;

		guest.name = newName;
	}

	function editGuestPoints(
		id: Guest["id"],
		newPoints: number,
		type: "legitimate" | "illegitimate",
		add: boolean = false,
	): void {
		const guest = getGuest(id);

		if (!guest) return;

		guest.points[type] = (add ? guest.points[type] : 0) + newPoints;
	}

	function getGuest(id: Guest["id"]): Guest | null {
		const guestIndex = list.value.findIndex((guest) => guest.id === id);

		return list.value[guestIndex] ?? null;
	}

	function resetActiveGuestID(): void {
		activeGuestID.value = null;
	}

	function fetchGuestListFromLocalStorage(): Guest[] {
		const list = localStorage.getItem("guestList");

		return list ? JSON.parse(list) : [];
	}

	watch(
		list,
		(guestList) => {
			localStorage.setItem("guestList", JSON.stringify(guestList));
		},
		{ deep: true },
	);

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
		resetActiveGuestID,
	};
});
