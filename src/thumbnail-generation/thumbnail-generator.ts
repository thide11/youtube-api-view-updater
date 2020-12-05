import nodeHtmlToImage from 'node-html-to-image';
import createFolderIfNotExists from '../utils/create-file';
import VideoYoutubeData from '../youtube-api/video-youtube-data';
import fs from "fs";

class ThumbnailGenerator {

  private DEFAULT_OUTPUT_DIR = `${process.env.TEMP}/youtube-api-view-updater/`;
  private DEFAULT_OUTPUT_URI = `${this.DEFAULT_OUTPUT_DIR}cached-tumbnail.png`;


  constructor() {

  }

  public async fromDefaultTemplate( videoData : VideoYoutubeData, outputDir : string = this.DEFAULT_OUTPUT_URI ) : Promise<string> {
    const params = {
      views: videoData.viewCount,
      likes: videoData.likesCount,
    } as { [key: string] : any };
  
    const htmlTemplate = fs.readFileSync("./src/thumbnail-generation/template/thumbnail.html").toString();
    const image = fs.readFileSync("./src/thumbnail-generation/template/everest.png");
    
    //@ts-ignore
    const base64Image = new Buffer.from(image).toString('base64');
    const dataURI = 'data:image/jpeg;base64,' + base64Image
  
    params["imgEverest"] = dataURI;
  
    return await this.fromTemplate(htmlTemplate, params);
  }

  async fromTemplate( templateHtml : string, changes : Object, outputDir : string = this.DEFAULT_OUTPUT_URI ) : Promise<string> {
    if(outputDir == this.DEFAULT_OUTPUT_URI) {
      createFolderIfNotExists(this.DEFAULT_OUTPUT_DIR);
    }

    await nodeHtmlToImage({
      output: outputDir,
      html: templateHtml,
      content: changes,
    })
    return outputDir;
  }
}

export default ThumbnailGenerator;