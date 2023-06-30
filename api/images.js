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

export const getImagesByConfigId = async (configId) => {
  const { _data } = await api(`v1/admin/configs/${configId}/images`, "GET");
  return _data;
};

export const addNewImage = async (image, parentConfig) => {
  const { _data } = await api(
    `v1/admin/configs/${parentConfig.configId}/images`,
    "POST",
    {
      configId: parentConfig.configId,
      imageName: image.name,
      imageData: image.data,
      parentConfig,
    }
  );
  return _data;
};

export const updateImageById = async (image, imageId, parentConfig) => {
  const { _data } = await api(
    `v1/admin/configs/${parentConfig.configId}/images/${imageId}`,
    "PUT",
    {
      configId: parentConfig.configId,
      imageId,
      imageName: image.name,
      imageData: image.data,
      parentConfig,
    }
  );
  return _data;
};

export const deleteImageById = async (imageId, parentConfigId) => {
  const response = await api(
    `v1/admin/configs/${parentConfigId}/images/${imageId}`,
    "DELETE"
  );
  if (response.status) return response.status;
  return response.response.status;
};
