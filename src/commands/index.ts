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
    Voice.bind({ message: mes });
    Voice.pause();
  },
  next: (mes: any) => {
    Voice.bind({ message: mes });
    Voice.next();
  },
  prev: (mes: any) => {
    Voice.bind({ message: mes });
    Voice.prev();
  },
} as any;

export default function messageHandling(command: string, message: Message<boolean>, bot: Client<boolean>) {
  ErrorBound(() => {
    const executer = Commands[command];
    if (!executer) {
      message.react('🙄');
      message.reply('Lệnh không tồn tại');
      return;
    }
    executer(message, bot);
  });
}