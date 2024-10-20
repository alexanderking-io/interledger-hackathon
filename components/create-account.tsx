import {
  useEffect,
  useState,
} from "react";

import { client } from "@/ts-rest/client";

export function CreateAcc() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountName, setAccountName] = useState("");
  const [transferDetails, setTransferDetails] = useState({
    sourceAccountId: "",
    destinationAccountId: "",
    amount: 0,
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      // TODO: determine which accounts to fetch
      const response = await client.fetchAccounts({
        query: { accountIds: [BigInt(0)] },
      });
      console.log('response', response);
      if (response.status !== 200) {
        throw Error("Failed to fetch accounts");
      }

      setAccounts(response.body.accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const createAccount = async () => {
    try {
      // TODO: determine values for new account
      const response = await client.createAccounts({
        body: {
          accounts: [
            {
              id: 0n,
              debits_pending: 0n,
              debits_posted: 0n,
              credits_pending: 0n,
              credits_posted: 0n,
              user_data_128: 0n,
              user_data_64: 0n,
              user_data_32: 0,
              reserved: 0,
              ledger: 0,
              code: 0,
              flags: 0,
              timestamp: 0n,
            },
          ],
        },
      });
      await fetchAccounts();
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  const createTransfer = async () => {
    try {
      client.createTransfers({
        body: {
          transfers: [
            {
              id: 0n,
              debit_account_id: BigInt(transferDetails.destinationAccountId),
              credit_account_id: BigInt(transferDetails.sourceAccountId),
              amount: BigInt(transferDetails.amount),
              pending_id: BigInt(0),
              user_data_128: BigInt(0),
              user_data_64: BigInt(0),
              user_data_32: 0,
              timeout: 0,
              timestamp: BigInt(Date.now()),
              ledger: 0,
              code: 0,
              flags: 0,
            },
          ],
        },
      });
    } catch (error) {
      console.error("Error creating transfer:", error);
    }
  };

  return (
    <div>
      <h1>Tiger Beetle API Frontend</h1>

      <h2>Create Account</h2>
      <input
        type="text"
        value={accountName}
        onChange={(e) => setAccountName(e.target.value)}
        placeholder="Account Name"
      />

      <button onClick={createAccount}>Create Account</button>

      <h2>Accounts</h2>
      <ul>
        {accounts.map((account) => (
          <li key={BigInt(account.id)}>Account ID: {BigInt(account.id).toString()}</li>
        ))}
      </ul>

      <h2>Create Transfer</h2>

      <input
        type="text"
        value={transferDetails.sourceAccountId}
        onChange={(e) => setTransferDetails({ ...transferDetails, sourceAccountId: e.target.value })}
        placeholder="Source Account ID"
      />
      <input
        type="text"
        value={transferDetails.destinationAccountId}
        onChange={(e) => setTransferDetails({ ...transferDetails, destinationAccountId: e.target.value })}
        placeholder="Destination Account ID"
      />
      <input
        type="number"
        value={transferDetails.amount}
        onChange={(e) => setTransferDetails({ ...transferDetails, amount: Number(e.target.value) })}
        placeholder="Amount"
      />
      <button onClick={createTransfer}>Create Transfer</button>
    </div>
  );
}
