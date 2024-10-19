import { AuthenticatedClient } from "@interledger/open-payments";

async function getWalletAddress(client: AuthenticatedClient, walletAddressUrl: string) {
    return await client.walletAddress.get({ url: walletAddressUrl });
}
  
module.exports = { getWalletAddress };