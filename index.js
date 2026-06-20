require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const Groq = require("groq-sdk");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

client.once("ready", () => {
  console.log(`Bot aktif: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    return message.reply("Pong!");
  }

  if (!message.content.startsWith("!ai")) return;

  const prompt = message.content.replace("!ai", "").trim();

  if (!prompt) {
    return message.reply("Masukkan pertanyaan setelah !ai");
  }

  try {
    const chat = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile"
    });

    await message.reply(chat.choices[0].message.content);

  } catch (err) {
    console.error(err);
    message.reply("Error: " + err.message);
  }
});

client.login(process.env.DISCORD_TOKEN);