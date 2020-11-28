import OAuthServer from "./server/o-auth-server";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import OAuthCacheManager from "./o-auth-cache-manager";

class OAuthController {

  private SCOPES : string[] = [
    "https://www.googleapis.com/auth/youtube.force-ssl"
  ]

  private DEFAULT_REDIRECT_URL : string = "http://localhost:3000/oauth2callback";

  public async signIn() : Promise<OAuth2Client> {

    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      this.DEFAULT_REDIRECT_URL
    );

    let tokens : any;
    let cache;
    try {
      cache = new OAuthCacheManager();
      tokens = await cache.getCache();
    } catch (e) {
       
      const oauthUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: this.SCOPES
      });
  
      const code = await OAuthServer.openOAuthLogin(oauthUrl);
      const userData = await oauth2Client.getToken(code);
      tokens= userData.tokens;

      cache?.saveCache(tokens);
    }
    //@ts-ignore
    oauth2Client.setCredentials(tokens);
    console.info('Tokens acquired.');
    return oauth2Client;

  }

  

}

export default OAuthController;