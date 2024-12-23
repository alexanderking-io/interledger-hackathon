import { AuthenticatedClient, WalletAddress } from "@interledger/open-payments";

export async function createIncomingPayment(client: AuthenticatedClient, resourceServerUrl: string, accessToken: string, walletAddress: WalletAddress, expiresAt: string|null = null) {
    return await client.incomingPayment.create(
      { url: resourceServerUrl, accessToken },
      {
        walletAddress: walletAddress.id,
        expiresAt: expiresAt!
      },
    );
}
  
export async function createQuote(client: AuthenticatedClient, resourceServerUrl: string, accessToken: string, walletAddress: WalletAddress, receiver: string, serviceType: string) {
   var amount = serviceType === "video" ? process.env.VIDEO_WATCH_CHARGE! : process.env.PER_SECOND_RATE_LIMIT!;
    return await client.quote.create(
      { url: resourceServerUrl, accessToken },
      {
        walletAddress: walletAddress.id,
        receiver,
        method: "ilp",
        debitAmount: { assetCode: walletAddress.assetCode, assetScale: walletAddress.assetScale, value: amount },
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