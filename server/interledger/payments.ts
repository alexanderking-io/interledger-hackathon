import { AuthenticatedClient, WalletAddress } from "@interledger/open-payments";

export async function createIncomingPayment(client: AuthenticatedClient, resourceServerUrl: string, accessToken: string, walletAddress: WalletAddress, assetCode: string, assetScale: number, value: string, expiresAt: string|null = null) {
    return await client.incomingPayment.create(
      { url: resourceServerUrl, accessToken },
      {
        walletAddress: walletAddress.id,
        // incomingAmount: { assetCode, assetScale, value },
        // expiresAt: expiresAt!
      },
    );
}
  
export async function createQuote(client: AuthenticatedClient, resourceServerUrl: string, accessToken: string, walletAddress: WalletAddress, receiver: string) {
    return await client.quote.create(
      { url: resourceServerUrl, accessToken },
      {
        walletAddress: walletAddress.id,
        receiver,
        method: "ilp",
        debitAmount: { assetCode: walletAddress.assetCode, assetScale: walletAddress.assetScale, value: process.env.PER_SECOND_RATE_LIMIT! },
      }
    );
}
  
export async function createOutgoingPayment(client: AuthenticatedClient, resourceServerUrl: string, accessToken: string, walletAddress: WalletAddress, quoteId: string) {
    return await client.outgoingPayment.create(
      { url: resourceServerUrl, accessToken },
      {
        walletAddress: walletAddress.id,
        quoteId,
      }
    );
}