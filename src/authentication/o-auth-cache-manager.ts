import fs from "fs";

class OAuthCacheManager {
  
  private CACHE_DIR : string = (process.env.HOME || process.env.USERPROFILE ||
    process.env.HOMEPATH) + '\\.credentials\\cache\\';

  private CACHE_PATH : string = this.CACHE_DIR + "autentication-cache.json";

  getCache() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.CACHE_PATH, function(err, token) {
        if (err) {
          reject("Sem arquivos para carregar no cache");
        } else {
          resolve(JSON.parse(token.toString()));
        }
      });
    })
  }

  saveCache( data : any ) {
    try {
      fs.mkdirSync(this.CACHE_DIR, {
        recursive: true
      });
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(this.CACHE_PATH, JSON.stringify(data), (err) => {
      if (err) throw err;
    });
  }

}

export default OAuthCacheManager;