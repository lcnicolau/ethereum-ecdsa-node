import { secp256k1 as ecdsa } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";

import { useState } from "react";
import server from "./server";

function Wallet({ privateKey, setPrivateKey, address, setAddress, balance, setBalance }) {
  const [publicKey, setPublicKey] = useState("");

  async function loadBalance(address) {
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      return balance;
    } else {
      return 0;
    }
  }

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    if (privateKey.length === 64) {
      try {
        const compresed = ecdsa.getPublicKey(privateKey);
        setPublicKey(toHex(compresed));
        const publicKey = ecdsa.getPublicKey(privateKey, false);
        const address = keccak256(publicKey.slice(1)).slice(-20);
        setAddress('0x' + toHex(address));
        loadBalance('0x' + toHex(address)).then(balance => setBalance(balance));
      } catch (ex) {
        console.log(ex);
      }
    } else {
      setPublicKey("");
      setAddress("");
      setBalance("");
    }
  }

  return (
    <div className="container wallet">
      <h2>Your Wallet</h2>

      <label>
        Private Key:
        <span className="generated">It will not be sent to the server</span>
        <input type="password" placeholder="Paste your private key, it will not be displayed" value={privateKey} onChange={onChange} required></input>
      </label>

      <label>
        Public key:
        <span className="generated">{publicKey || "Will be recovered from the private key"}</span>
      </label>

      <label>
        Wallet Address:
        <span className="generated">{address || "Will be recovered from the public key"}</span>
      </label>

      <label className="balance">Balance: {balance}</label>
    </div>
  );
}

export default Wallet;
