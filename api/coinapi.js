/* eslint-disable no-console */
const api = async (endpoint, method, payload) => {
  try {
    const app = useNuxtApp();
    const response = await app.$api.raw(endpoint, {
      method: method,
      body: payload,
    });
    return response;
  } catch (err) {
    console.error("postApi error", err);
    return err;
  }
};

export const getBlockchains = async () => {
  const response = await api(`/v5/blockchains`, "GET");
  if (response._data) {
    return response._data;
  } else if (response.status) {
    return response.status;
  } else {
    return "Cors Error";
  }
};

export const getProviders = async () => {
  const response = await api(`/v1/providersettings`, "GET");
  if (response._data) {
    return response._data;
  } else if (response.status) {
    return response.status;
  } else {
    return "Cors Error";
  }
};
