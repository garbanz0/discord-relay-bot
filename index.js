const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const content = message.content;
  const image = message.attachments.first()?.url;
  
  const payload = {
    username: message.author.username,
    content: content,
    embeds: image ? [{ image: { url: image } }] : []
  };

  await axios.post(process.env.WEBHOOK_URL, payload);
});

client.login(process.env.BOT_TOKEN);
