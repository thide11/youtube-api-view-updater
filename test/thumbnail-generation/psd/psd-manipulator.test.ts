
import fs from "fs";
import ThumbnailGenerator from "../../../src/thumbnail-generation/thumbnail-generator";

it('Shoul create a template', async () => {
  const params = {
    views: "90",
    likes: "47",
  }

  const htmlTemplate = fs.readFileSync("./src/thumbnail-generation/template/thumbnail.html").toString();
  const image = fs.readFileSync("./src/thumbnail-generation/template/everest.png");
  //@ts-ignore
  const base64Image = new Buffer.from(image).toString('base64');
  const dataURI = 'data:image/jpeg;base64,' + base64Image
  //@ts-ignore
  params["imgEverest"] = dataURI;

  const thumbnailGenerator = new ThumbnailGenerator();
  await thumbnailGenerator.fromTemplate(htmlTemplate, params);
}, 20000);