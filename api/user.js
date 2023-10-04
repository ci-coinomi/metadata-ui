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
    console.error(err);
    return err;
  }
};

export const signin = async (username, password) => {
  const response = await api(`admin/auth/login`, "POST", {
    username,
    password,
  });
  if (response.status) {
    return response.status;
  } else {
    return "Cors Error";
  }
};

export const signout = async () => {
  const response = await api("admin/auth/logout", "POST");
  if (response.status) {
    return response.status;
  } else {
    return "Cors Error";
  }
};

export const addUser = async (username, password, roles, enabled) => {
  const response = await api(`admin/users`, "POST", {
    username,
    password,
    roles,
    enabled,
  });
  if (response.status) {
    return response.status;
  } else {
    return "Cors Error";
  }
};

export const updateUser = async (username, roles, enabled) => {
  const response = await api(`admin/users`, "PUT", {
    username,
    roles,
    enabled,
  });
  if (response.status) {
    return response.status;
  } else {
    return "Cors Error";
  }
};

export const deleteUser = async (login) => {
  const response = await api(`admin/users/${login}`, "DELETE");
  if (response.status) {
    return response.status;
  } else {
    return "Cors Error";
  }
};

export const getUsers = async () => {
  const response = await api(`admin/users`, "GET");
  if (response._data) {
    return response._data;
  } else if (response.status) {
    return response.status;
  } else {
    return "Cors Error";
  }
};

export const getMe = async () => {
  const response = await api(`admin/users/me`, "GET");
  return response;
};
