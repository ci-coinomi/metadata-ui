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
    console.log("postApi error", err);
    return err;
  }
};

const api2 = async (endpoint, method, payload) => {
  try {
    const app = useNuxtApp();
    const response = await app.$api2.raw(endpoint, {
      method: method,
      body: payload,
    });
    return response;
  } catch (err) {
    console.log("postApi error", err);
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
// https://backend-dev2.euclabs.net/coinapi/polygon/topic/blockchain/height
export const getProviders = async () => {
  const response = await api(`/v1/providersettings?provider=ethereum`, "GET");
  if (response._data) {
    return response._data;
  } else if (response.status) {
    return response.status;
  } else {
    return "Cors Error";
  }
};

export const getHeight = async () => {
  const response = await api2(`/coinapi/ethereum`, "GET");
  console.log("RES IS", response);
  if (response._data) {
    return response._data;
  } else if (response.status) {
    return response.status;
  } else {
    return "Cors Error";
  }
};
