import { Client, GatewayIntentBits } from 'discord.js';
import axios from 'axios';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Start minimal Express server to keep Render web service alive
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`));

// Discord bot setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // Only allow messages from a specific channel
  if (message.channel.id !== '1389982292222545920') return;

  const content = message.content;
  const image = message.attachments.first()?.url;

  const payload = {
    username: message.author.username,
    avatar_url: message.author.displayAvatarURL({ format: 'png' }),
    content: content,
    embeds: image ? [{ image: { url: image } }] : []
  };

  try {
    await axios.post(process.env.WEBHOOK_URL, payload);
    console.log(`📤 Message relayed: ${content}`);
  } catch (err) {
    console.error('❌ Failed to send message:', err.response?.data || err.message);
  }
});

client.login(process.env.BOT_TOKEN);
