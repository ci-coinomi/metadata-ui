/* eslint-disable no-console */

const getApi = async (endpoint, payload) => {
  try {
    const app = useNuxtApp();
    const response = await app.$api.raw(endpoint, {
      method: "GET",
      body: payload,
    });
    return response;
  } catch (err) {
    console.log("postApi error", err);
    return err;
  }
};

const putApi = async (endpoint, payload) => {
  try {
    const app = useNuxtApp();
    const response = await app.$api.raw(endpoint, {
      method: "PUT",
      body: payload,
    });
    return response;
  } catch (err) {
    console.log("postApi error", err);
    return err;
  }
};

const postApi = async (endpoint, payload) => {
  try {
    const app = useNuxtApp();
    const response = await app.$api.raw(endpoint, {
      method: "POST",
      body: payload,
    });
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const deleteApi = async (endpoint, payload) => {
  try {
    const app = useNuxtApp();
    const response = await app.$api.raw(endpoint, {
      method: "DELETE",
      body: payload,
    });
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getConfigs = async () => {
  const { _data } = await getApi(`v1/admin/configs`);
  return _data;
};

export const getConfigById = async (id) => {
  const { _data } = await getApi(`v1/admin/configs/${id}`);
  return _data;
};

export const getConfigsTypes = async () => {
  const { _data } = await getApi(`v1/admin/configs/types`);
  return _data;
};

export const updateConfig = async (previousConfig, updatedConfigFile) => {
  const { configId, configName, configType } = previousConfig;
  const { _data } = await putApi(`v1/admin/configs/${configId}`, {
    configId,
    configName,
    configType,
    configFile: updatedConfigFile,
  });
  return _data;
};

export const cloneConfig = async (newConfigName, parentConfig) => {
  const { _data } = await postApi(`v1/admin/configs`, {
    configName: newConfigName,
    configType: parentConfig.configType,
    configFile: parentConfig.configFile,
  });
  return _data;
};

export const deleteConfig = async (configId) => {
  const response = await deleteApi(`v1/admin/configs/${configId}`);
  // If successful - return response status, if error - status from error object.
  if (response.status) return response.status;
  return response.response.status;
};
