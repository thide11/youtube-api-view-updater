import { GoogleApis, youtube_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import VideoYoutubeData from "./video-youtube-data";
import fs from "fs";

class YoutubeApi {

  public youtube : youtube_v3.Youtube; 

  constructor(google : GoogleApis, oAuthCredentials : OAuth2Client ) {
    this.youtube = google.youtube({
      version: "v3",
      auth: oAuthCredentials,
    })  
  }

  public async getVideoInfo(videoId : string) : Promise<VideoYoutubeData> {
    const videos = await this.youtube.videos.list({
      id: [videoId],
      part: ["statistics", "snippet"],
      maxResults: 1
    });
    if(videos.data.items?.length == 1) {
      const [ video ] = videos.data.items;

      const viewCount = video.statistics?.viewCount;
      const likesCount = video.statistics?.likeCount;
      const categoryId = video.snippet?.categoryId;

      if(!viewCount || !categoryId || !likesCount) {
        throw new Error("Api não pegou os dados corretamente");
      }
      return {
        viewCount,
        categoryId,
        likesCount,
      }
    } else {
      throw new Error("Video não encontrado");
    }
  }

  public async updateVideo(videoId : string, newTitle : string, newCategory : string) {
    await this.youtube.videos.update({
      part: ["snippet"],
      requestBody: {
        id: videoId,
        snippet: {
          title: newTitle,//"Este video tem " + viewCount + " views",
          categoryId: newCategory,
          tags: ["Debug"]
        }
      }
    })
  }

  public async updateThumbnail(videoId : string, newThumnailUri : string) {
    const buffer = fs.createReadStream(newThumnailUri);

    await this.youtube.thumbnails.set({
      videoId,
      media: {
        mimeType: "image/png",
        body: buffer
      },
    })
  }

}

export default YoutubeApi;