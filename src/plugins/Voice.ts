//@ts-ignore
import { dlAudio } from "youtube-exec";
import { Guild, Message } from "discord.js";
import { AudioPlayer, AudioPlayerStatus, NoSubscriberBehavior, StreamType, VoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { createReadStream } from "fs";
import { youtubeDownload } from "../helper/downloader";
import { exec } from 'child_process';
import config from '../../config';

class VoiceProcess {
  guid: string = '';
  channelId: string = '';
  index: number = 0;
  listAudio: string[] = [];
  isPlay = false;
  //@ts-ignore
  player: AudioPlayer;
  //@ts-ignore
  connection: VoiceConnection;
  //@ts-ignore
  message: Message<boolean>;

  bind = (args: Partial<this>) => {
    Object.assign(this, args);
  }

  join = () => {
    if (this.connection) {
      return;
    }
    const { guild = {} as Guild } = this.message;
    //@ts-ignore
    const { channel: channelVoice } = this.message.member.voice;
    this.connection = joinVoiceChannel({
      channelId: channelVoice?.id ?? '',
      guildId: guild?.id ?? '',
      // @ts-ignore
      adapterCreator: guild?.voiceAdapterCreator,
    });
    this.connection.on('error', error => {
      console.error(error, 'error con');
    });
  }

  leave = () => {
    this.connection.disconnect();
    this.connection.destroy();
    this.player?.stop(true);
    //@ts-ignore
    this.connection = null;
    //@ts-ignore
    this.player = null;
    this.listAudio.forEach(link => exec(`rm '${link}'`));
    this.index = 0;
    this.done('Tạm biệt');
  }

  pause = () => {
    this.player.pause();
    this.done(`Ê tao đang hát bắt dừng chi mậy??`);
  }

  next = () => {
    if (this.listAudio.length - 1 === this.index) {
      this.message.reply('Bài này là bài cuối rồi');
      this.message.react('😅');
      return;
    }
    this.index += 1;
    const resource = this.getResource();
    this.player.stop(true);
    this.player.play(resource);
    this.done('Thằng tiếp theo đâu??');

  }

  prev = () => {
    if (this.index === 0) {
      this.message.reply('Bài này là bài đầu rồi');
      this.message.react('😅');
      return;
    }
    this.index -= 1;
    const resource = this.getResource();
    this.player.stop(true);
    this.player.play(resource);
    this.done('Thằng nữa đâu??');

  }

  private handing = () => {
    this.message.reactions.removeAll();
    this.message.react('👀');
  }

  private done = (content?: string) => {
    this.message.reactions.removeAll();
    this.message.react('🥳');
    if (content) {
      this.message.reply(content);
    }
  }

  private getResource = () => {
    const resource = createAudioResource(createReadStream(this.listAudio[this.index]), {
      inlineVolume: true,
      inputType: StreamType.OggOpus,
    });
    resource?.volume?.setVolume(0.5)
    return resource;
  }

  play = async () => {
    this.handing();
    const { content } = this.message;

    const isEmpty = content.indexOf(' ') === -1;
    const query = content.slice(content.indexOf(' ') + 1);
    console.log(query);

    if (!this.connection) {
      this.join();
    }

    if (this.connection && this.player) {
      if (!this.isPlay && isEmpty) {
        this.player.unpause();
        return;
      }
      else if (!isEmpty) {
        const path = await youtubeDownload(query);
        this.listAudio.push(path);
        this.done('Rồi rồi tao biết rồi 🙄');
        if(this.listAudio.length > 3){
          this.message.reply('Ê tao mệt nha đòi hỏi lắm thế 🥵');
        }
        return;
      }
    }

    if (!this.player) {
      this.player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause,
        },
      });

      this.player.on('stateChange', (state, newState) => {
        if ([
          AudioPlayerStatus.Buffering,
          AudioPlayerStatus.Playing
        ].includes(newState.status)) {
          this.isPlay = true;
        }
        if (newState.status === AudioPlayerStatus.Paused) {
          this.isPlay = false;
        }
        if (newState.status === AudioPlayerStatus.Idle) {
          if (this.listAudio.length - 1 === this.index) {
            this.isPlay = false;
            this.index += 1;
          } else {
            this.index += 1;
            const resource = this.getResource();
            this.player.stop(true);
            this.player.play(resource);
          }
        }
      });
      this.connection.subscribe(this.player);
    }

    let path = null;
    try {
      path = await youtubeDownload(query);
    } catch (error) {
      return;
    }
    if (!path) return;
    this.listAudio.push(path);
    const resource = this.getResource();
    this.isPlay = true;
    resource?.volume?.setVolume(0.5);
    this.player.play(resource);
    this.done('Hát thì hát :)))');
  }

}



export default new VoiceProcess();