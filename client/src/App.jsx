import Wallet from "./Wallet";
import Welcome from "./Welcome";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [privateKey, setPrivateKey] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");

  return (
    <div className="app">
      <Wallet
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        address={address}
        setAddress={setAddress}
        balance={balance}
        setBalance={setBalance}
      />
      {balance > 0
        ? <Transfer address={address} setBalance={setBalance}/>
        : <Welcome address={address} setBalance={setBalance}/>
      }
    </div>
  );
}

export default App;
