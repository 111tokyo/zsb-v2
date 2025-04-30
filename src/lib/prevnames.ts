export const getUsernames = async (userId: string) => {
  try {
    const response = await fetch(
      `https://prevname-discord.vercel.app/api/search?id=${userId}`,
      {
        method: 'GET',
      },
    );

    const data = await response.json();
    return data?.prevname ?? null;
  } catch {
    return null;
  }
};
export const getGlobals = async (userId: string) => {
  try {
    const response = await fetch(
      `https://prevname-discord.vercel.app/api/search?id=${userId}`,
      {
        method: 'GET',
      },
    );

    const data = await response.json();
    return data?.prevglobalname ?? null;
  } catch {
    return null;
  }
};
