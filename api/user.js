/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
const getApi = async (endpoint) => {
  const app = useNuxtApp();
  try {
    const res = await app.$api.get(endpoint);
    return res;
  } catch (err) {
    console.error(err);
  }
};

const postApi = async (endpoint, payload) => {
  const app = useNuxtApp();
  try {
    const res = await app.$api.post(endpoint, payload);
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const login = async (username, password) => {
  const response = await postApi(`/metadata/admin/auth/login`, {
    username,
    password,
  });
  return response.data.data;
};
