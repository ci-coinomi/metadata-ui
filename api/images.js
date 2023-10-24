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

export const getImagesByConfigId = async (configId) => {
  const response = await api(`v1/admin/configs/${configId}/images`, "GET");
  if (response._data) return { success: true, data: response._data };
  if (response.status) return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};

export const addNewImage = async ({ imageName, imageData }, parentConfig) => {
  const response = await api(
    `v1/admin/configs/${parentConfig.configId}/images`,
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

export const updateImageById = async (image, imageId, parentConfig) => {
  const response = await api(
    `v1/admin/configs/${parentConfig.configId}/images/${imageId}`,
    "PUT",
    {
      configId: parentConfig.configId,
      imageId,
      imageName: image.name,
      imageData: image.data,
      parentConfig,
    },
  );
  if (response._data) return { success: true, data: response._data };
  if (response.status) return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};

export const deleteImageById = async (imageId, parentConfigId) => {
  const response = await api(
    `v1/admin/configs/${parentConfigId}/images/${imageId}`,
    "DELETE",
  );
  if (response && response.status === 204)
    return { success: true, status: response.status };
  if (response && response.status !== 204)
    return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};
