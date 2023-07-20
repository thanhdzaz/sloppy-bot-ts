import { getVideoMP3Binary } from "yt-get";
import {
  writeFile
} from 'fs';

export async function youtubeDownload(videoURL: string) {
  return new Promise<string>((res) => {
    getVideoMP3Binary(videoURL)
      .then((result) => {
        const { mp3, title } = result;
        const path = `./resource/${title}.mp3`;
        console.log("Video Title:", path);
        writeFile(path, mp3, () => {
          res(path)
        });
        // Use the `mp3` Buffer as needed.
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  })

}