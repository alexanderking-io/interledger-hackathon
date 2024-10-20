import { Account, Transfer } from "tigerbeetle-node";

import { tigerBeetle } from "../utils/tigerbeetle";

class TigerBeetleService {
  async getAccounts(accountIdList: bigint[]) {
    const accounts = await tigerBeetle.lookupAccounts(accountIdList);

    return accounts;
  }

  async createAccounts(accounts: Account[]) {
    //   const accountId = id();
    //   const acc: Account = {
    //     id: accountId,
    //     debits_pending: 0n,
    //     debits_posted: 0n,
    //     credits_pending: 0n,
    //     credits_posted: 0n,
    //     user_data_128: 0n,
    //     user_data_64: 0n,
    //     user_data_32: 0,
    //     reserved: 0,
    //     ledger: 1,
    //     code: 718,
    //     flags: 0,
    //     timestamp: 0n,
    //   };

    await tigerBeetle.createAccounts(accounts);
  }

  async createTransfers(transfers: Transfer[]) {
    await tigerBeetle.createTransfers(transfers);
  }
}

export const tigerBeetleService = new TigerBeetleService();