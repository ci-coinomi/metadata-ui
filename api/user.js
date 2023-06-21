/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
const tempUrl = "https://backend-dev2.euclabs.net/metadata/admin/auth/login";

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
  const app = useNuxtApp();
  try {
    const res = await app.$api.post(endpoint, payload);
    console.log("ax", res);
    return res;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const signin = async (username, password) => {
  // const response = await postApi(`admin/auth/login`, {
  //   username,
  //   password,
  // });

  const response = await $fetch
    .raw(tempUrl, {
      headers: { "Content-type": "application/json" },
      method: "POST",
      body: {
        username,
        password,
      },
    })
    .catch((err) => {
      console.log(err);
      return err;
    });

  // If successful - return status:
  if (response.status) return response.status;
  // If error - return status from error object:
  return response.response.status;
};

export const logout = async () => {
  const response = await postApi("admin/auth/logout");
  // If successful return status:
  if (response.status) return response.status;
  // If error return status from error object:
  return response.response.status;
};
