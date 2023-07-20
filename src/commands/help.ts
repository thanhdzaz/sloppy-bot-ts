import { Client, Message } from "discord.js";

export default async function (message: Message, bot: Client<boolean>) {
  message.reply('Rép đi');
}