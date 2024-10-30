const api = async (endpoint, method, payload) => {
  try {
    const app = useNuxtApp();
    const response = await app.$api.raw(endpoint, {
      method,
      body: payload,
    });
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
};

/**
 * This method will be called on login and forbidden-page, so console is excess
 */
const loginApi = async (endpoint, method, payload) => {
  try {
    const app = useNuxtApp();

    const formData = new FormData();
    for (const key in payload) {
      formData.append(key, payload[key]);
    }

    const response = await app.$loginApi.raw(endpoint, {
      method,
      body: formData,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const signin = async (username, password) => {
  const response = await loginApi(`auth/login`, "POST", {
    username,
    password,
  });

  if (response && (response.status === 204 || response.status === 200))
    return { success: true, status: response.status };
  if (response && response.status !== 204)
    return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};

export const signout = async () => {
  const response = await api("admin/auth/logout", "POST");
  if (response && response.status === 204)
    return { success: true, status: response.status };
  if (response && response.status !== 204)
    return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};

export const addUser = async (username, password, roles, enabled) => {
  const response = await api(`admin/users`, "POST", {
    username,
    password,
    roles,
    enabled,
  });
  if (response && response.status === 201)
    return { success: true, status: response.status };
  if (response && response.status !== 201)
    return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};

export const updateUser = async (username, roles, enabled) => {
  const response = await api(`admin/users`, "PUT", {
    username,
    roles,
    enabled,
  });
  if (response && response.status === 200)
    return { success: true, status: response.status };
  if (response && response.status !== 200)
    return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};

export const deleteUser = async (login) => {
  const response = await api(`admin/users/${login}`, "DELETE");
  if (response && response.status === 204)
    return { success: true, status: response.status };
  if (response && response.status !== 204)
    return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};

export const getUsers = async () => {
  const response = await api(`admin/users`, "GET");
  if (response._data) return { success: true, data: response._data };
  if (response.status) return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};

export const getMe = async () => {
  const response = await api(`admin/users/me`, "GET");
  if (response && response.status === 200)
    return { success: true, data: response._data };

  if (response && response.status !== 200)
    return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};

export const getLoginMe = async () => {
  const response = await loginApi(`admin/users/me`, "GET");
  if (response && response.status === 200)
    return { success: true, data: response._data };

  if (response && response.status !== 200)
    return { success: false, status: response.status };
  return { success: false, status: "Cors Error" };
};
