import { type Ref, type InjectionKey } from "vue";

export const revealProgressInjectionKey = Symbol() as InjectionKey<Ref<number>>;
export const revealProgressLimitInjectionKey = Symbol() as InjectionKey<Ref<number>>;
