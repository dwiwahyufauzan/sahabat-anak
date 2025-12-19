import { writable } from 'svelte/store';

export const formData = writable({
  name: '',
  email: '',
  phone: '',
  category: ''
});

export const formErrors = writable({
  name: '',
  email: '',
  phone: '',
  category: ''
});

export const isSubmitting = writable(false);

export function resetForm() {
  formData.set({
    name: '',
    email: '',
    phone: '',
    category: ''
  });
  formErrors.set({
    name: '',
    email: '',
    phone: '',
    category: ''
  });
}
