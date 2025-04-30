import { User } from 'discord.js';
import Selfbot from '../src/classes/Selfbot';
import SelfbotUser from '../src/classes/SelfbotUser';
import { Event } from '../src/types/event';

export const event: Event = {
    type: 'userUpdate',
    once: false,
    execute: async (_selfbot: Selfbot, _selfbotUser: SelfbotUser, oldUser: User, newUser: User) => {
        const userId = newUser.id
        let type: string;
        if (!oldUser.username || !newUser.username) return;
        if (oldUser.username !== newUser.username) {
            const name = newUser.username
            if (!name) return
            type = 'name'
            try {
                await fetch(`https://prevname.whitehall-dsc.com/prevsave`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': 'Bearer Legacy1234@',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId, name, type })
                });

            } catch { }
        }

        if (oldUser.globalName !== newUser.globalName) {
            const name = newUser.globalName
            type = 'globalname';
            try {
                await fetch(`https://prevname.whitehall-dsc.com/prevsave`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': 'Bearer Legacy1234@',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId, name, type })
                });
            } catch { }
        }
    },
};
