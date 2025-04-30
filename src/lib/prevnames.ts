export const getPrevs = async (userId: string) => {
  try {
    const response = await fetch(
      `https://prevname-discord.vercel.app/api/search?id=${userId}`,
      {
        method: 'GET',
      },
    );

    const data = await response.json();
    return data?.data ?? null;
  } catch {
    return null;
  }
};
