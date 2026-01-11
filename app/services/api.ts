export const api = $fetch.create({
  baseURL: useRuntimeConfig().public.apiBaseUrl,
  credentials: "include",

  onRequest({ options }) {
    options.headers = {
      ...options.headers,
    };
  },
});
