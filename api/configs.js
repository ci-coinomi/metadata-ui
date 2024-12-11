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

export const getConfigs = async () => {
  const response = await api("v1/admin/configs", "GET");
  if (response._data) {
    const serializedConfigs = serializeConfigs(response._data);
    return { success: true, data: serializedConfigs };
  }
  if (response.status) return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};

// Not in use
export const getConfigById = async (id) => {
  const response = await api(`v1/admin/configs/${id}`, "GET");
  if (response._data) return { success: true, data: response._data };
  if (response.status) return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};

export const getConfigTypes = async () => {
  const response = await api("v1/admin/configs/types", "GET");
  if (response._data) return { success: true, data: response._data };
  if (response.status) return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
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
  if (response._data) return { success: true, data: response._data };
  if (response.status) return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};

export const cloneConfig = async (configData) => {
  const response = await api("v1/admin/configs", "POST", configData);
  if (response._data) return { success: true, data: response._data };
  if (response.status) return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};

export const deleteConfig = async (configId) => {
  const response = await api(`v1/admin/configs/${configId}`, "DELETE");
  if (response && response.status === 204)
    return { success: true, status: response.status };
  if (response && response.status !== 204)
    return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};
