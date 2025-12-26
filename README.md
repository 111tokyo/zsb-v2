# 🤖 ZSB 2.0

> [!CAUTION]
> **Risk of Ban:** This project involves the use of selfbots, which are strictly against [Discord's Terms of Service](https://discord.com/terms). Using this software can result in the permanent suspension of your Discord account. Use at your own risk.

> [!WARNING]
> **Archived Project:** This repository is **archived and no longer maintained**. The code provided here is for educational or historical purposes only. It is likely that the code **no longer works** due to updates in the Discord API or dependencies. No support will be provided.

**ZSB** is a legacy selfbot infrastructure designed to act as a stealth controller for Discord user accounts. It was built to manage interactions programmatically using a hybrid stack of standard Discord bots and user accounts (selfbots), with advanced audio processing capabilities.

## ✨ Features (Legacy)

- 🔌 **Multi-User Shadowing**: Architecture designed to manage multiple user tokens simultaneously.
- 🎙️ **Audio Intelligence**: Integration with **AssemblyAI** for voice transcription and audio processing.
- 🗄️ **Database Persistence**: Robust data management using **Prisma ORM**.
- 🤖 **Hybrid Core**: Utilizes both `discord.js` (v14) and `discord.js-selfbot-v13` for maximum capability.
- ⚡ **TypeScript**: Fully typed codebase for reliability.

## 🛠️ Setup (Archived)

> **Note:** These instructions are for historical reference. You may encounter dependency conflicts.

1. Clone the repository:
```
git clone https://github.com/111tokyo/zsb-v2.git
cd zsb-v2
```
2. Install dependencies (using NPM):
```
npm install
```
3. Configure Environment:
   Create a .env file in the root directory with the following variables:
```
DISCORD_TOKEN=your_user_token
DATABASE_URL="file:./dev.db"
ASSEMBLYAI_API_KEY=your_assemblyai_key
```
# Add any other required keys based on the source code

4. Initialize the Database:
   Run the Prisma migration to set up the schema (uses the 'db' script from package.json):
```
npm run db
```
5. Run the bot:

# For development (compiles TS and runs):
```
npm run dev
```
# For production:
```
npm run build
npm start
```
## 🧰 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Selfbot Library**: discord.js-selfbot-v13 (v3.3.0)
- **Standard Library**: discord.js (v14)
- **Database**: Prisma ORM
- **AI Services**: AssemblyAI
- **HTTP**: Axios

## 👥 Contributing

**This project is abandoned.**
Contributions are not accepted as the repository is archived. Feel free to fork the project for your own educational use.

## 📜 License

This project is licensed under the **ISC License**.

## 📞 Support

There is no active support for this project.
Original Discord server (might be inactive): https://discord.gg/cCFWjhGjAJ

---
- GitHub: [111tokyo](https://github.com/111tokyo), [Snayzou](https://github.com/sqlu)
- Discord: `111tokyo`, `early.lover`
