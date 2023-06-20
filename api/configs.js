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

export const getConfigs = async () => {
  const response = await getApi(`v1/admin/configs`);
  return response;
};

export const getConfigsTypes = async () => {
  const response = await getApi(`v1/admin/configs/types`);
  return response;
};
