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

export const getConfigs = async () => {
  const response = await api(`v1/admin/configs`, "GET");
  if (response._data) {
    const serializedConfigs = serializeConfigs(response._data);
    return serializedConfigs;
  } else if (response.status) {
    return response.status;
  } else {
    return "Cors Error";
  }
};

export const getConfigById = async (id) => {
  const response = await api(`v1/admin/configs/${id}`, "GET");
  if (response._data) {
    return response._data;
  } else if (response.status) {
    return response.status;
  } else {
    return "Cors Error";
  }
};

export const getConfigsTypes = async () => {
  const response = await api(`v1/admin/configs/types`, "GET");
  if (response._data) {
    return response._data;
  } else if (response.status) {
    return response.status;
  } else {
    return "Cors Error";
  }
};

export const updateConfig = async (previousConfig, updatedConfigFile) => {
  const { configId, configName, configType, parentConfig } = previousConfig;
  const response = await api(`v1/admin/configs/${configId}`, "PUT", {
    configId,
    configName,
    configType,
    configFile: updatedConfigFile,
    parentConfig,
  });
  if (response._data) {
    return response._data;
  } else if (response.status) {
    return response.status;
  } else {
    return "Cors Error";
  }
};

export const cloneConfig = async (configData) => {
  const response = await api(`v1/admin/configs`, "POST", configData);
  if (response._data) {
    return response._data;
  } else if (response.status) {
    return response.status;
  } else {
    return "Cors Error";
  }
};

export const deleteConfig = async (configId) => {
  const response = await api(`v1/admin/configs/${configId}`, "DELETE");
  if (response.status) {
    return response.status;
  } else {
    return "Cors Error";
  }
};

export const getProviderGroup = async () => {
  const response = await api(`/v2/provider/groups`, "GET");
  if (response._data) {
    return response._data;
  } else if (response.status) {
    return response.status;
  } else {
    return "Cors Error";
  }
};

export const getProviderNetworks = async () => {
  const response = await api(`/v2/provider/networks`, "GET");
  if (response._data) {
    return response._data;
  } else if (response.status) {
    return response.status;
  } else {
    return "Cors Error";
  }
};
