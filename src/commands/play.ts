import { Client, Message } from "discord.js"
import { createReadStream } from 'fs';
import { NoSubscriberBehavior, StreamType, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import Voice from "../plugins/Voice";

export default async function (message: Message, bot: Client<boolean>) {
  const { channel, guild } = message;
  Voice.bind({ message })
  Voice.play();


}