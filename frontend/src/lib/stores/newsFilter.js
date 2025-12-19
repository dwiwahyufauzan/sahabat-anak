import { writable } from 'svelte/store';

export const activeCategory = writable('all');
export const searchQuery = writable('');
export const currentPage = writable(1);
