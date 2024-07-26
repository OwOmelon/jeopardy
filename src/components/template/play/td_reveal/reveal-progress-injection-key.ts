import { type Ref, type InjectionKey } from "vue";

// PROVIDED PROPERTIES CAN BE FOUND IN "TableDataReveal.vue"
export const revealProgressInjectionKey = Symbol() as InjectionKey<{
	revealProgress: Readonly<Ref<number>>;
	revealProgressLimit: Readonly<Ref<number>>;
}>;

export const updateRevealProgressInjectionKey = Symbol() as InjectionKey<{
	revertProgress: () => void;
	advanceProgress: () => void;
}>;
