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
  const response = await api(`/v1/blockchains`, "GET");
  if (response._data) return { success: true, data: response._data };
  if (response.status) return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};

export const getProviders = async () => {
  const response = await api(`/v1/providersettings`, "GET");
  if (response._data) return { success: true, data: response._data };
  if (response.status) return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};
