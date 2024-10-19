import { AuthenticatedClient, WalletAddress } from "@interledger/open-payments";

async function createIncomingPayment(client: AuthenticatedClient, resourceServerUrl: string, accessToken: string, walletAddress: WalletAddress, assetCode: string, assetScale: number, value: string) {
    return await client.incomingPayment.create(
      { url: resourceServerUrl, accessToken },
      {
        walletAddress: walletAddress.id,
        incomingAmount: { assetCode, assetScale, value },
      }
    );
  }
  
  async function createQuote(client: AuthenticatedClient, resourceServerUrl: string, accessToken: string, walletAddress: WalletAddress, receiver: string) {
    return await client.quote.create(
      { url: resourceServerUrl, accessToken },
      {
        walletAddress: walletAddress.id,
        receiver,
        method: "ilp",
      }
    );
  }
  
  async function createOutgoingPayment(client: AuthenticatedClient, resourceServerUrl: string, accessToken: string, walletAddress: WalletAddress, quoteId: string) {
    return await client.outgoingPayment.create(
      { url: resourceServerUrl, accessToken },
      {
        walletAddress: walletAddress.id,
        quoteId,
      }
    );
  }
  
  module.exports = { createIncomingPayment, createQuote, createOutgoingPayment };  