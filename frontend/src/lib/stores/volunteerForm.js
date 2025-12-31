import { writable } from 'svelte/store';

export const formData = writable({
  name: '',
  email: '',
  phone: '',
  category: '',
  skills: '',
  address: '',
  motivation: '',
  availability: ''
});

export const formErrors = writable({
  name: '',
  email: '',
  phone: '',
  category: '',
  photo: ''
});

export const isSubmitting = writable(false);

export function resetForm() {
  formData.set({
    name: '',
    email: '',
    phone: '',
    category: '',
    skills: '',
    address: '',
    motivation: '',
    availability: ''
  });
  formErrors.set({
    name: '',
    email: '',
    phone: '',
    category: '',
    photo: ''
  });
}
