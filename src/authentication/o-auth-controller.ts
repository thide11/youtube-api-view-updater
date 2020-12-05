import OAuthServer from "./server/o-auth-server";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import OAuthCacheManager from "./o-auth-cache-manager";

class OAuthController {

  private SCOPES : string[] = [
    "https://www.googleapis.com/auth/youtube.force-ssl",
    "https://www.googleapis.com/auth/youtube.upload",
  ]

  private DEFAULT_REDIRECT_URL : string = "http://localhost:3000/oauth2callback";

  public constructor(private cacheStorage : OAuthCacheManager) {}

  public async signIn() : Promise<OAuth2Client> {

    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      this.DEFAULT_REDIRECT_URL
    );

    let tokens : any;
    try {
      if(process.env.LOGIN_DATA) {
        tokens = JSON.parse(process.env.LOGIN_DATA);
        // console.log(tokens);
      } else {
        console.log("Tentando pegar do cache")
        tokens = await this.cacheStorage.getCache();
      }
    } catch (e) {
      const oauthUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: this.SCOPES,
        prompt: 'consent'
      });
  
      const code = await OAuthServer.openOAuthLogin(oauthUrl);
      const userData = await oauth2Client.getToken(code);
      tokens= userData.tokens;

      this.cacheStorage.saveCache(tokens);
    }
    // oauth2Client.
    oauth2Client.setCredentials(tokens);

    this.autoRefreshAcessToken(oauth2Client);

    return oauth2Client;

  }

  public autoRefreshAcessToken(oauth2Client : OAuth2Client) {
    oauth2Client.on('tokens', async (tokens) => {
      console.log("Verificando token");
      if (tokens.refresh_token) {
        console.log("Atualizando token...")
        this.cacheStorage.saveCache(tokens);
      }
    });
  }

  

}

export default OAuthController;