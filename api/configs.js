/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

const getApi = async (endpoint, payload) => {
  try {
    const config = useRuntimeConfig();
    const response = await $fetch.raw(endpoint, {
      method: "GET",
      baseURL: config.public.METADATA_URL,
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Content-type": "application/json",
      },
      body: payload,
      credentials: "include",
    });
    return response;
  } catch (err) {
    console.log("postApi error", err);
    return err;
  }
};

export const getConfigs = async () => {
  const { _data } = await getApi(`v1/admin/configs`);
  return _data;
};

export const getConfigsTypes = async () => {
  const { _data } = await getApi(`v1/admin/configs/types`);
  return _data;
};
