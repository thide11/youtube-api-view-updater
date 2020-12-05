import fs from "fs";

export default function createFolderIfNotExists(directory : string) {
  try {
    fs.mkdirSync(directory, {
      recursive: true
    });
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
}