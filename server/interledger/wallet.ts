import { AuthenticatedClient } from "@interledger/open-payments";

export async function getWalletAddress(client: AuthenticatedClient, walletAddressUrl: string) {
    return await client.walletAddress.get({ url: walletAddressUrl });
}