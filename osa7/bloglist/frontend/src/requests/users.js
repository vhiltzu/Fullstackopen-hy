const baseUrl = "/api/users";

export const getUsers = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  return await response.json()
};