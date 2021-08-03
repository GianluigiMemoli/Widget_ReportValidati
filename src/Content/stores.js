import {writable} from "svelte/store";
export const frequenze = writable([]);
export const nomeProgetto = writable("");
export const date = writable({
    "start_date": null,
    "end_date": null
});
export const downloaded = writable({});

