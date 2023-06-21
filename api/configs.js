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

export const getConfigs = async () => {
  // const response = await getApi(`v1/admin/configs`);

  const response = await $fetch
    .raw("https://backend-dev2.euclabs.net/metadata/admin/configs")
    .catch((err) => {
      console.log(err);
      return err;
    });

  return response;
};

export const getConfigsTypes = async () => {
  // const response = await getApi(`v1/admin/configs/types`);

  const response = await $fetch
    .raw("https://backend-dev2.euclabs.net/metadata/admin/configs/types")
    .catch((err) => {
      console.log(err);
      return err;
    });

  return response;
};
