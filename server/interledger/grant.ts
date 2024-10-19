import { AuthenticatedClient, OpenPaymentsClientError, isFinalizedGrant } from "@interledger/open-payments";

export async function requestGrant(client : AuthenticatedClient, authServerUrl : string, access : Object, interact : Object|null) {

    interface LooseObject {
        [key: string]: any
    }
    
    var tokenObject: LooseObject = {};
    tokenObject.access_token = { access };

    if (interact !== null) {
        tokenObject.interact = interact;
    }

    let grantTokenObject = JSON.parse(JSON.stringify(tokenObject));

    console.log("Requesting grant from", authServerUrl, "with token object", JSON.stringify(grantTokenObject));

    return await client.grant.request(
        {
            url: authServerUrl
        },
        grantTokenObject,
    );
}

export async function continueGrant(client: AuthenticatedClient, continueUri: string, accessToken: string, interactRef: string) {
  try {
    const grant = await client.grant.continue(
      {
        url: continueUri,
        accessToken,
      },
      {
        interact_ref: interactRef
      }
    );
    if (!isFinalizedGrant(grant)) {
      console.log("Error: Grant was not finalized.");
      process.exit();
    }
    return grant;
  } catch (err) {
    if (err instanceof OpenPaymentsClientError) {
      console.log("Grant continuation failed. Please try again.");
      process.exit();
    }
    throw err;
  }
}