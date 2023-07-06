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
    console.log(err);
    return err;
  }
};

export const signin = async (username, password) => {
  const response = await api(`admin/auth/login`, "POST", {
    username,
    password,
  });
  return response.status;
};

export const signout = async () => {
  const response = await api("admin/auth/logout", "POST");
  return response.status;
};

export const addUser = async (username, password, roles, enabled) => {
  const response = await api(`admin/users`, "POST", {
    username,
    password,
    roles,
    enabled,
  });
  return response.status;
};

export const updateUser = async (username, roles, enabled) => {
  const response = await api(`admin/users`, "PUT", {
    username,
    roles,
    enabled,
  });
  return response.status;
};

export const deleteUser = async (login) => {
  const response = await api(`admin/users/${login}`, "DELETE");
  return response.status;
};

export const getUsers = async () => {
  const response = await api(`admin/users`, "GET");
  if (response._data) {
    return response._data;
  } else {
    return response.status;
  }
};

export const getMe = async () => {
  const response = await api(`admin/users/me`, "GET");
  return response;
};
