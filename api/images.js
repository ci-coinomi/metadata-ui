const api = async (endpoint, method, payload) => {
  try {
    const app = useNuxtApp();
    const response = await app.$api.raw(endpoint, {
      method,
      body: payload,
    });
    return response;
  } catch (err) {
    console.error("postApi error", err);
    return err;
  }
};

export const getImagesByConfigId = async (configId) => {
  const response = await api(`v1/admin/configs/${configId}/image`, "GET");
  if (response._data) return { success: true, data: response._data };
  if (response.status === 204) return { success: true, data: null };
  if (response.status) return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};

export const addNewImage = async ({ imageName, imageData }, parentConfig) => {
  const response = await api(
    `v1/admin/configs/${parentConfig.configId}/image`,
    "POST",
    {
      configId: parentConfig.configId,
      imageName,
      imageData,
      parentConfig,
    },
  );
  if (response._data) return { success: true, data: response._data };
  if (response.status) return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};
