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
  // If successful - return response status, if error - status from error object.
  if (response.status) return response.status;
  return response.response.status;
};

export const signout = async () => {
  const response = await api("admin/auth/logout", "POST");
  return response;
};

export const addUser = async (username, password, role) => {
  const response = await api(`admin/users`, "POST", {
    username,
    password,
    roles: [role],
  });
  if (response.status) return response.status;
  return response.response.status;
};

export const deleteUser = async (login) => {
  const response = await api(`admin/users/${login}`, "DELETE");
  if (response.status) return response.status;
  return response.response.status;
};
