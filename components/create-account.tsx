import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Form } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from './ui/form';
import { Input } from './ui/input';
export function CreateAcc(){

        const [accounts, setAccounts] = useState<any[]>([]);
        const [accountName, setAccountName] = useState('');
        const [transferDetails, setTransferDetails] = useState({
          sourceAccountId: '',
          destinationAccountId: '',
          amount: 0,
        });
      
        useEffect(() => {
          fetchAccounts();
        }, []);
      
        const fetchAccounts = async () => {
          try {
            const response = await axios.get('http://localhost:5000/api/accounts');
            setAccounts(response.data);
          } catch (error) {
            console.error('Error fetching accounts:', error);
          }
        };
      
        const createAccount = async () => {
          try {
            await axios.post('http://localhost:5000/api/accounts', { name: accountName });
            setAccountName('');
            fetchAccounts();
          } catch (error) {
            console.error('Error creating account:', error);
          }
        };

      
        const createTransfer = async () => {
          try {
            await axios.post('http://localhost:5000/api/transfers', transferDetails);
            setTransferDetails({ sourceAccountId: '', destinationAccountId: '', amount: 0 });
          } catch (error) {
            console.error('Error creating transfer:', error);
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
              {accounts.map(account => (
                <li key={account.id}>{account.name} (ID: {account.id})</li>
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
        )
   
      

}

