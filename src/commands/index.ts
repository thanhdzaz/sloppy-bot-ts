import { Client, Message } from 'discord.js';
import join from './join';
import leave from './leave';
import help from './help';
import play from './play';
import { ErrorBound } from '../helper';
import Voice from '../plugins/Voice';

const Commands = {
  help,
  join,
  leave,
  play,
  pause: (mes: any) => {
    Voice.pause();
  },
  next: (mes: any) => {
    Voice.next();
  },
  prev: (mes: any) => {
    Voice.prev();
  },
  speak: () => {
    Voice.speak();
  },
  s: () => {
    Voice.speak();
  }
} as any;

export default function messageHandling(command: string, message: Message<boolean>, bot: Client<boolean>) {
  ErrorBound(() => {
    const executer = Commands[command];
    if (!executer) {
      message.react('🙄');
      message.reply('Cái đéo gì đấy tao không hiểu');
      return;
    }
    Voice.bind({ message, channel: message.channel, guid: message.guild })
    executer(message, bot);
  });
}