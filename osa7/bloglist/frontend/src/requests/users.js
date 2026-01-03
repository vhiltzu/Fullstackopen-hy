const baseUrl = "/api/users";

export const getUsers = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  return await response.json()
};

export const getUserById = async (id) => {
  const response = await fetch(`${baseUrl}/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }

  return await response.json();
};