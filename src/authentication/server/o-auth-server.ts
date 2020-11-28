import * as http from 'http';
import url from 'url';
import open from 'open';

abstract class OAuthServer {

  static PORT : number = 3000

  public static openOAuthLogin(url : string) : Promise<string> {
    return new Promise((resolve, reject) => {
      const server = http
        .createServer(async (req, res) => {
          try {
            if(req.url) {
              if (req?.url?.indexOf('/oauth2callback') > -1) {
                const code = this.getCodeFromQueryParam(req.url);
                res.end('Authentication successful! Please return to the console.');
                server.close();
                resolve(code);
              }
            }
          } catch (e) {
            console.error(e);
            reject(e);
          }
        })
        .listen(this.PORT, async () => {
          const cp = await open(
            url, 
            {
              wait: false
            }
          );
          cp.unref();
        });
    });
  }

  private static getCodeFromQueryParam(url : string) {
    console.log("Url recebida: ");
    console.log(url);
    const qs = new URL(url, 'http://localhost:3000')
      .searchParams;
    const code = qs.get('code');
    console.log(`Code is ${code}`);
    if(code) {
      return code;
    } else {
      throw new Error("O código da api não foi retornado, autenticação fracassada");
    }
  }

}

export default OAuthServer