import { createAuthenticatedClient } from "@interledger/open-payments";

export async function createClient(walletAddressUrl : string, keyId : string, privateKey : string) {
    return await createAuthenticatedClient({
      walletAddressUrl,
      keyId,
      privateKey,
    });
}