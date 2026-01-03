const baseUrl = "/api/login";

export const login = async (user) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

  const request = fetch(baseUrl, options);
  const response = await request;

  return await response.json();
};