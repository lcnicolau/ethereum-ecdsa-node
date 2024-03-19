import { secp256k1 as ecdsa } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";

import { useState } from "react";
import server from "./server";

let timeout;

function Transfer({ privateKey, address, setBalance }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [payload, setPayload] = useState("");

  async function getTransactionCount(address) {
    if (address) {
      const {
        data: { count },
      } = await server.get(`history/${address}`);
      return count;
    } else {
      return 0;
    }
  }

  async function hashAndSign(sender, recipient, amount, nonce) {
    const transaction = {
      sender: sender,
      recipient: recipient,
      amount: parseInt(amount),
      nonce: nonce
    };
    const data = JSON.stringify(transaction);
    const hash = keccak256(utf8ToBytes(data));
    const signature = ecdsa.sign(hash, privateKey);
    return {
      transaction,
      signature
    };
  }

  async function onChange(evt) {
    const newRecipient = (evt.target.type === 'text') ? evt.target.value : recipient;
    setRecipient(newRecipient);

    const newAmount = (evt.target.type === 'number') ? evt.target.value : amount;
    setAmount(newAmount);

    if (newRecipient && newAmount) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        getTransactionCount(address)
          .then(nonce => hashAndSign(address, newRecipient, newAmount, nonce))
          .then(payload => setPayload(payload))
      }, 500);
    } else {
      setPayload("");
    }
  }

  async function transfer(payload) {
    if (payload) {
      const {
        data: { balance },
      } = await server.post(`send`, payload);
      return balance;
    } else {
      console.log("Must provide valid transaction data");
    }
  }

  async function onSubmit(evt) {
    evt.preventDefault();
    try {
      transfer(payload).then(balance => {
        setBalance(balance);
        setRecipient("");
        setAmount("");
        setPayload("");
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={onSubmit}>
      <h1>Send Transaction</h1>

      <label>
        Recipient:
        <input placeholder="Type an address, for example: 0x2" value={recipient} onChange={onChange} required></input>
      </label>

      <label>
        Amount:
        <input type="number" min="0" placeholder="1, 2, 3..." value={amount} onChange={onChange} required></input>
      </label>

      <label>
        Payload:
        {payload
          ? <pre className="generated">{JSON.stringify(payload, undefined, 2)}</pre>
          : <span className="generated">Will be generated from the transaction data and signed with your private key</span>
        }
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
