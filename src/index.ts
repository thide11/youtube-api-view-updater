import dotenv from "dotenv";
import OAuthController from "./authentication/o-auth-controller";
import {google} from "googleapis";
import OAuthCacheManagerImpl from "./authentication/o-auth-cache-manager";
import YoutubeApi from "./youtube-api/youtube-api";
import ThumbnailGenerator from "./thumbnail-generation/thumbnail-generator";
import express from "express";
dotenv.config();

const cache = new OAuthCacheManagerImpl();
const oAuthController = new OAuthController(cache);

if(process.env.STANDALONE == "true") {
  createExpressServer();
} else {
  run(oAuthController);
}

function createExpressServer() {
  const app = express();
  const port = process.env.PORT || "3000";
  app.get('/', async function (_ : any, res : any) {
    await run(oAuthController);
    res.status(200).send("Video updated successfully!");
  });
  app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });
}

async function run(oAuthController : OAuthController) {
  if(!process.env.VIDEO_ID) {
    throw new Error("Please set-up an VIDEO_ID on the .env file")
  }
  const oAuthCredentials = await oAuthController.signIn();

  const youtubeApi = new YoutubeApi(google, oAuthCredentials);
  
  const videoId = process.env.VIDEO_ID;
  
  console.log("--Taking current view count--")
  const videoYoutubeData = await youtubeApi.getVideoInfo(videoId);
  console.log(`Views caught, current video has ${videoYoutubeData.viewCount} views`)

  const title = `Este video tem ${videoYoutubeData.viewCount} views`;

  console.log(`--Updating video title--`)
  await youtubeApi.updateVideo(videoId, title, videoYoutubeData.categoryId);
  console.log(`Video title updated`)

  console.log(`--Changing thumbnail--`)
  const thumbnail = new ThumbnailGenerator();
  console.log(`Generating thumbnail by template`)
  const thumbnailUrl = await thumbnail.fromDefaultTemplate(videoYoutubeData);
  console.log(`Generated thumbnail`)

  console.log(`Uploading the new thumbnail`)
  await youtubeApi.updateThumbnail(videoId, thumbnailUrl);
  console.log(`Updated thumbnail`)

  console.log("Video updated!");
}