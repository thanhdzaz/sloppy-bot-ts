import { Client } from 'discord.js';
import config from '../config'
import { Message } from 'discord.js';
import messageHandling from './commands';

const client = new Client({ intents: ['Guilds', "GuildMessages", "MessageContent", "GuildVoiceStates"] });

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('messageCreate', async (message: Message) => {
  console.log('mess', message.content);
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args?.shift()?.toLowerCase();

  try {
    if (command) {
      messageHandling(command, message, client);
    }
  } catch (error) {
    console.log(error);
  }

});

client.login(config.token);
