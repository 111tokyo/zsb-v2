import { Prevname } from "../types/prevnames";

interface APIResponse {
    data: any;
    error?: string;
}

export default class ZsbPrev {
    readonly #apiKey: string;
    readonly #baseUrl = 'https://prevname-discord.vercel.app/api/search?id=';
    readonly #timeout = 5000;

    constructor(apiKey: string) {
        this.#apiKey = apiKey;
    }

    async #fetchData(endpoint: string, method: string, body: Record<string, any> | null = null): Promise<any> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.#timeout);

            const response = await fetch(`${this.#baseUrl}${endpoint}`, {
                method,
                headers: {
                    'Authorization': this.#apiKey,
                    'Content-Type': 'application/json',
                },
                body: body ? JSON.stringify(body) : null,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const data: APIResponse = await response.json();
            return data?.data ?? null;
        } catch {
            return null;
        }
    }

    public async getNames(userID: string) {
        try {
            const data = await this.#fetchData(userID, 'POST');
            const prevnames = data.prevname || [];
            return prevnames.map((name: any) => ({
                id: name.id,
                name: name.name,
                date: name.date,
                source: name.source
            }));
        } catch{
            return null;
        }
    }

    public async getDisplay(userID: string) {
        try {
            return await this.#fetchData(userID, 'POST', { userId: userID });
        } catch {
            return null;
        }
    }

    public async allPrevnames(userID: string): Promise<Prevname[] | null> {
        try {
            return await this.#fetchData(userID, 'POST', { userId: userID });
        } catch {
            return null;
        }
    }

}