import dotenv from "dotenv";
import OAuthController from "./authentication/o-auth-controller";
import {google} from "googleapis";
import OAuthCacheManagerImpl from "./authentication/o-auth-cache-manager";
import YoutubeApi from "./youtube-api/youtube-api";
import ThumbnailGenerator from "./thumbnail-generation/thumbnail-generator";
import express from "express";

dotenv.config();

const app = express();
const port = process.env.PORT || "3000";

app.get('/', async function (req : any, res : any) {
  const cache = new OAuthCacheManagerImpl();
  const oAuthController = new OAuthController(cache);
  await run(oAuthController);
  res.status(200).send("Video atualizado com sucesso!");
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

async function run(oAuthController : OAuthController) {
  if(!process.env.VIDEO_ID) {
    throw new Error("Please set-up an VIDEO_ID on the .env file")
  }
  const oAuthCredentials = await oAuthController.signIn();

  const youtubeApi = new YoutubeApi(google, oAuthCredentials);
  
  const videoId = process.env.VIDEO_ID;
  
  console.log("--Pegando contagem de visualizações atual--")
  const videoYoutubeData = await youtubeApi.getVideoInfo(videoId);
  console.log(`Visualizações pegas, o video atual tem ${videoYoutubeData.viewCount} views`)

  const title = `Este video tem ${videoYoutubeData.viewCount} views`;

  console.log(`--Atualizando titulo do video--`)
  await youtubeApi.updateVideo(videoId, title, videoYoutubeData.categoryId);
  console.log(`Titulo do video atualizado`)

  console.log(`--Alterando thumbnail--`)
  const thumbnail = new ThumbnailGenerator();
  console.log(`Gerando thumbnail pelo template`)
  const thumbnailUrl = await thumbnail.fromDefaultTemplate(videoYoutubeData);
  console.log(`Thumbnail gerada`)

  console.log(`Fazendo upload da nova thumbnail`)
  await youtubeApi.updateThumbnail(videoId, thumbnailUrl);
  console.log(`thumbnail atualizada`)

  console.log("Video atualizado!");
}