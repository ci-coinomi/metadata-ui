/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

const postApi = async (endpoint, payload) => {
  try {
    const app = useNuxtApp();
    const response = await app.$myFetch.raw(endpoint, {
      method: "POST",
      body: payload,
    });
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const signin = async (username, password) => {
  const response = await postApi(`admin/auth/login`, {
    username,
    password,
  });
  // If successful - return response status, if error - status from error object.
  if (response.status) return response.status;
  return response.response.status;
};

export const signout = async () => {
  const response = await postApi("admin/auth/logout");
  return response;
};
