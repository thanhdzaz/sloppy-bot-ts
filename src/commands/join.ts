import { Client, Message } from "discord.js";
import Voice from "../plugins/Voice";

export default async function (message: Message, bot: Client<boolean>) {
  const { channel, guild } = message;
  if (!message.member?.voice.channel) {
    message.reply('You need to be in a voice channel to use this command.');
    return;
  }

  Voice.bind({ message })
  Voice.join();
}