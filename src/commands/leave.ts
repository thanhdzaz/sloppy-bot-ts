import { Client, Message } from "discord.js"
import { getVoiceConnection } from '@discordjs/voice';
import Voice from "../plugins/Voice";

export default async function (message: Message, bot: Client<boolean>) {
  const { channel, guild } = message;
  if (!message.member?.voice.channel) {
    message.reply('You need to be in a voice channel to use this command.');
    return;
  }

  const { channel: channelVoice } = message.member.voice;

  // Join the voice channel
  if (!guild) {
    message.reply('Không tìm thấy máy chủ')
    return;
  }

  Voice.bind({ message });
  Voice.leave();
  message.reply(`Leave ${channelVoice.name} the voice channel! `);
}