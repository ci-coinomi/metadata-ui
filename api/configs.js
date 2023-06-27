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
  const { _data } = await api(`v1/admin/configs`, "GET");
  return _data;
};

export const getConfigById = async (id) => {
  const { _data } = await api(`v1/admin/configs/${id}`, "GET");
  return _data;
};

export const getConfigsTypes = async () => {
  const { _data } = await api(`v1/admin/configs/types`, "GET");
  return _data;
};

export const updateConfig = async (previousConfig, updatedConfigFile) => {
  const { configId, configName, configType } = previousConfig;
  const { _data } = await api(`v1/admin/configs/${configId}`, "PUT", {
    configId,
    configName,
    configType,
    configFile: updatedConfigFile,
  });
  return _data;
};

export const cloneConfig = async (newConfigName, parentConfig) => {
  const { _data } = await api(`v1/admin/configs`, "POST", {
    configName: newConfigName,
    configType: parentConfig.configType,
    configFile: parentConfig.configFile,
  });
  return _data;
};

export const deleteConfig = async (configId) => {
  const response = await api(`v1/admin/configs/${configId}`, "DELETE");
  // If successful - return response status, if error - status from error object.
  if (response.status) return response.status;
  return response.response.status;
};
