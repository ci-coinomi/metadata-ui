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
  const response = await api(`v1/admin/configs/${configId}/images`, "GET");
  if (response._data) {
    return response._data;
  } else {
    return response.status;
  }
};

export const addNewImage = async (image, parentConfig) => {
  const response = await api(
    `v1/admin/configs/${parentConfig.configId}/images`,
    "POST",
    {
      configId: parentConfig.configId,
      imageName: image.name,
      imageData: image.data,
      parentConfig,
    }
  );
  if (response._data) {
    return response._data;
  } else {
    return response.status;
  }
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
    }
  );
  if (response._data) {
    return response._data;
  } else {
    return response.status;
  }
};

export const deleteImageById = async (imageId, parentConfigId) => {
  const response = await api(
    `v1/admin/configs/${parentConfigId}/images/${imageId}`,
    "DELETE"
  );
  return response.status;
};
