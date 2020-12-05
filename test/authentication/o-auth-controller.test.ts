import OAuthController from "../../src/authentication/o-auth-controller";
import OAuthCacheManager from "../../src/domain/o-auth-cache-manager";
import OAuthCacheManagerImpl from "../../src/authentication/o-auth-cache-manager";

it('Deve cachear o controller', async () => {

  const getCacheFn = jest.fn();
  const saveCacheFn = jest.fn();

  getCacheFn.mockImplementation(async () => {
    throw new Error("Sem arquivos para carregar no cache");
  })

  const cache = {
    getCache: getCacheFn,
    saveCache: saveCacheFn
  };
  const controller = new OAuthController(cache as unknown as OAuthCacheManagerImpl);
  await controller.signIn();
});