import { Prevname } from "../types/prevnames";

interface APIResponse {
    data: any;
    error?: string;
}

export default class ZsbPrev {
    readonly #apiKey: string;
    readonly #baseUrl = 'https://api.snoway-bots.xyz/api/v1';
    readonly #timeout = 3000;

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
            return await this.#fetchData('/prevname/get', 'POST', { userId: userID });
        } catch{
            return null;
        }
    }

    public async getDisplay(userID: string) {
        try {
            return await this.#fetchData('/prevDisplay/get', 'POST', { userId: userID });
        } catch {
            return null;
        }
    }

    public async allPrevnames(userID: string): Promise<Prevname[] | null> {
        try {
            return await this.#fetchData('/allprevnames', 'POST', { userId: userID });
        } catch {
            return null;
        }
    }

    public async ping() {
        try {
            return await this.#fetchData('/ping', 'GET');
        } catch {
            return null;
        }
    }

    async count() {
        try {
            return await this.#fetchData('/prevname/count', 'GET');
        } catch {
            return null;
        }
    }
}