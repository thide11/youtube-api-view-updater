import dotenv from "dotenv";
import OAuthController from "./authentication/o-auth-controller";
import {google} from "googleapis";
dotenv.config();
const oAuthController = new OAuthController();
run();
async function run() {
  const oAuthCredentials = await oAuthController.signIn();
  console.log(oAuthCredentials);
  //oAuthCredentials.
  const youtube = google.youtube({
    version: "v3",
    auth: oAuthCredentials,
  })

  const videoId = "vGa7GtbYCjI";

  const videos = await youtube.videos.list({
    id: [videoId],
    part: ["statistics", "snippet"],
    maxResults: 1
  });

  if(videos.data.items?.length == 1) {
    const [ video ] = videos.data.items;

    const viewCount = video.statistics?.viewCount;
    const categoryId = video.snippet?.categoryId;
    console.log("View count capturado")
    console.log(viewCount);
    console.log(categoryId);
    await youtube.videos.update({
      part: ["snippet"],
      requestBody: {
        id: videoId,
      
        snippet: {
          title: "Bicho safadão",//"Este video tem " + viewCount + " views",
          categoryId: categoryId,
          tags: ["Debug"]
        }
      }
    })
  }
}