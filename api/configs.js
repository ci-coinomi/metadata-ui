/* eslint-disable no-console */

const getApi = async (endpoint, payload) => {
  try {
    const app = useNuxtApp();
    const response = await app.$api.raw(endpoint, {
      method: "GET",
      body: payload,
    });
    return response;
  } catch (err) {
    console.log("postApi error", err);
    return err;
  }
};

export const getConfigs = async () => {
  const { _data } = await getApi(`v1/admin/configs`);
  return _data;
};

export const getConfigItemById = async (id) => {
  const { _data } = await getApi(`v1/admin/configs/${id}`);
  return _data;
};

export const getConfigsTypes = async () => {
  const { _data } = await getApi(`v1/admin/configs/types`);
  return _data;
};
