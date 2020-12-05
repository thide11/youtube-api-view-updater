interface OAuthCacheManager {
  getCache() : any;
  saveCache( data : any ) : Promise<void>;
}

export default OAuthCacheManager;