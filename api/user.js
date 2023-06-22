/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

const getApi = async (endpoint) => {
  const app = useNuxtApp();
  try {
    const res = await app.$api.get(endpoint);
    return res;
  } catch (err) {
    console.log(err);
  }
};

const postApi = async (endpoint, payload) => {
  try {
    const config = useRuntimeConfig();
    const response = await $fetch.raw(endpoint, {
      method: "POST",
      baseURL: config.public.METADATA_URL,
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Content-type": "application/json",
      },
      body: payload,
      credentials: "include",
    });
    return response;
  } catch (err) {
    console.log("postApi error", err);
    return err;
  }
};

export const signin = async (username, password) => {
  const response = await postApi(`admin/auth/login`, {
    username,
    password,
  });
  // If successful - return response status
  if (response.status) return response.status;
  // If error - return status from error object
  return response.response.status;
};

export const signout = async () => {
  const response = await postApi("admin/auth/logout");
  if (response.status) return response.status;
  return response.response.status;
};
