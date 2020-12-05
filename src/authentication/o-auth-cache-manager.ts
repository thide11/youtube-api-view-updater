import fs from "fs";
import OAuthCacheManager from "../domain/o-auth-cache-manager";
import createFolderIfNotExists from "../utils/create-file";

class OAuthCacheManagerImpl implements OAuthCacheManager {
  
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

  public async saveCache( data : any ) : Promise<void> {
    createFolderIfNotExists(this.CACHE_DIR);

    fs.writeFileSync(this.CACHE_PATH, JSON.stringify(data));
  }

}

export default OAuthCacheManagerImpl;