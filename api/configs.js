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

export const getConfigs = async () => {
  const response = await api(`v1/admin/configs`, "GET");
  if (response._data) {
    return response._data;
  } else {
    return response.status;
  }
};

export const getConfigById = async (id) => {
  const response = await api(`v1/admin/configs/${id}`, "GET");
  if (response._data) {
    return response._data;
  } else {
    return response.status;
  }
};

export const getConfigsTypes = async () => {
  const response = await api(`v1/admin/configs/types`, "GET");
  if (response._data) {
    return response._data;
  } else {
    return response.status;
  }
};

export const updateConfig = async (previousConfig, updatedConfigFile) => {
  const { configId, configName, configType } = previousConfig;
  const response = await api(`v1/admin/configs/${configId}`, "PUT", {
    configId,
    configName,
    configType,
    configFile: updatedConfigFile,
  });
  if (response._data) {
    return response._data;
  } else {
    return response.status;
  }
};

export const cloneConfig = async (configData) => {
  const response = await api(`v1/admin/configs`, "POST", configData);
  if (response._data) {
    return response._data;
  } else {
    return response.status;
  }
};

export const deleteConfig = async (configId) => {
  const response = await api(`v1/admin/configs/${configId}`, "DELETE");
  return response.status;
};
