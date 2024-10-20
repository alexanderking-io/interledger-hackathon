import { createClient } from "./client";
import { getWalletAddress } from "./wallet";
import { requestGrant, continueGrant } from "./grant";
import { createIncomingPayment, createQuote, createOutgoingPayment } from "./payments";

export async function initiatePayment(senderUrl: string, serviceType: string) {
    if (!senderUrl) {
        throw new Error("senderUrl is undefined");
    }
    const client = await createClient(process.env.BASE_WALLET_ADDRESS!, process.env.KEY_ID!, process.env.PRIVATE_KEY!);

    const sendingWalletAddress = await getWalletAddress(client, senderUrl);
    const receivingWalletAddress = await getWalletAddress(client, process.env.BASE_WALLET_ADDRESS!);

    console.log("Sending wallet address", sendingWalletAddress);
    console.log("Receiving wallet address", receivingWalletAddress);

    const incomingPaymentGrant = await requestGrant(client, receivingWalletAddress.authServer, [
        { type: "incoming-payment", actions: ["list", "read", "read-all", "complete", "create"], },
    ], null);

    if (!('access_token' in incomingPaymentGrant)) {
        throw new Error("Incoming payment grant does not have an access token");
    }

    const incomingPayment = await createIncomingPayment(
        client,
        receivingWalletAddress.resourceServer,
        incomingPaymentGrant.access_token.value,
        receivingWalletAddress,
        new Date(Date.now() + 60000000 * 10).toISOString(),
    );

    console.log("Incoming payment created", incomingPayment);

    process.env.INCOMING_PAYMENT_ID = incomingPayment.id;

    const quoteGrant = await client.grant.request({
        url: sendingWalletAddress.authServer,
    }, {
        access_token: {
            access: [
                {
                    type: "quote",
                    actions: ["create", "read", "read-all"],
                }
            ],
        }
    });

    console.log("Quote grant", quoteGrant);

    // const quoteGrant2 = await requestGrant(client, sendingWalletAddress.authServer, [
    //     { type: "quote", actions: ["create", "read", "read-all"] },
    // ], null);

    // console.log("Quote grant 2", quoteGrant2);

    if (!('access_token' in quoteGrant)) {
        throw new Error("Quote grant does not have an access token");
    }

    // const quote1 = await client.quote.create(
    //     {
    //       url: sendingWalletAddress.resourceServer,
    //       accessToken: quoteGrant.access_token.value,
    //     },
    //     {
    //       method: "ilp",
    //       walletAddress: sendingWalletAddress.id,
    //       receiver: incomingPayment.id,
    //     },
    //   );

    // console.log("Quote created", quote1);
    // const quote = await createQuote(client, sendingWalletAddress.resourceServer, quoteGrant.access_token.value, sendingWalletAddress, incomingPayment.id, serviceType);

    // console.log("Quote created", quote);

    const outgoingPaymentGrant = await requestGrant(client, sendingWalletAddress.authServer, [
        {
            type: "outgoing-payment",
            actions: ["list", "list-all", "read", "read-all", "create"],
            limits: {
                receiver: incomingPayment.id,
                debitAmount: { assetCode: sendingWalletAddress.assetCode, assetScale: sendingWalletAddress.assetScale, value: "100" },
                interval: "R/2016-08-24T08:00:00Z/PT5S"
            },
            identifier: sendingWalletAddress.id,
        },
    ], {
        start: ["redirect"],
        finish: {
            method: "redirect",
            uri: process.env.PAYMENT_CONFIRMATION_URL!,
            nonce: process.env.NONCE!,
        },
    },);

    if (!('interact' in outgoingPaymentGrant)) {
        throw new Error("Outgoing payment grant does not have interact property");
    }

    process.env.SENDER_URL = senderUrl;
    process.env.CONTINUE_URI = outgoingPaymentGrant.continue.uri;
    process.env.CONTINUE_TOKEN = outgoingPaymentGrant.continue.access_token.value;

    return outgoingPaymentGrant.interact.redirect;
}

export async function completePayment(interact_ref: string) {
    let senderUrl = process.env.SENDER_URL!;
    let continueUri = process.env.CONTINUE_URI!;
    let accessToken = process.env.CONTINUE_TOKEN!;

    const client = await createClient(process.env.BASE_WALLET_ADDRESS!, process.env.KEY_ID!, process.env.PRIVATE_KEY!);

    console.log("Continuing grant with interact_ref", interact_ref);

    const finalizedOutgoingPaymentGrant = await continueGrant(client, continueUri, accessToken, interact_ref);

    console.log("Outgoing payment grant finalized", finalizedOutgoingPaymentGrant);

    process.env.MANAGE_URL = finalizedOutgoingPaymentGrant.access_token.manage;
    process.env.ACCESS_TOKEN = finalizedOutgoingPaymentGrant.access_token.value;

    const sendingWalletAddress = await client.walletAddress.get({ url: senderUrl });
    console.log("Sending wallet address", sendingWalletAddress);

    console.log("Incoming payment id", process.env.INCOMING_PAYMENT_ID);

    const outgoingPayment = await client.outgoingPayment.create({
        url: sendingWalletAddress.resourceServer,
        accessToken: finalizedOutgoingPaymentGrant.access_token.value,
    }, {
        walletAddress: sendingWalletAddress.id,
        incomingPayment: process.env.INCOMING_PAYMENT_ID!,
        debitAmount: { assetCode: sendingWalletAddress.assetCode, assetScale: sendingWalletAddress.assetScale, value: "100" },
    });

    // console.log("Outgoing payment created", outgoing);

    // const outgoingPayment = await createOutgoingPayment(client, sendingWalletAddress.resourceServer, finalizedOutgoingPaymentGrant.access_token.value, sendingWalletAddress, process.env.INCOMING_PAYMENT_ID!);

    console.log("Outgoing payment created", outgoingPayment);

    process.env.INCOMING_PAYMENT_ID = outgoingPayment.receiver;

    return outgoingPayment;
}

export async function recurringPayment(serviceType: string) {
    let senderUrl = process.env.SENDER_URL!;
    let accessToken = process.env.ACCESS_TOKEN!;
    let manageUrl = process.env.MANAGE_URL!;

    const client = await createClient(process.env.BASE_WALLET_ADDRESS!, process.env.KEY_ID!, process.env.PRIVATE_KEY!);

    const sendingWalletAddress = await client.walletAddress.get({ url: senderUrl });

    const quoteGrant = await requestGrant(client, sendingWalletAddress.authServer, [
        { type: "quote", actions: ["create", "read", "read-all"] },
    ], null);

    if (!('access_token' in quoteGrant)) {
        throw new Error("Quote grant does not have an access token");
    }

    const quote = await createQuote(client, sendingWalletAddress.resourceServer, quoteGrant.access_token.value, sendingWalletAddress, process.env.INCOMING_PAYMENT_ID!, serviceType);

    console.log("New Quote created", quote);

    const newToken = await client.token.rotate({
        url: manageUrl,
        accessToken: accessToken,
    });

    console.log("Token rotated", JSON.stringify(newToken.access_token.access));

    console.log("Token rotated", newToken);

    // process.env.ACCESS_TOKEN = newToken.access_token.value;
    // process.env.MANAGE_URL = newToken.access_token.manage;

    try {
        const outgoingPayment = await createOutgoingPayment(client, sendingWalletAddress.resourceServer, newToken.access_token.value, sendingWalletAddress, quote.id);
        console.log("Outgoing payment created", outgoingPayment);
    } catch (err) {
        console.log("Error creating outgoing payment", err);
    }
}