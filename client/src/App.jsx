import Wallet from "./Wallet";
import Welcome from "./Welcome";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      {balance > 0
        ? <Transfer address={address} setBalance={setBalance}/>
        : <Welcome address={address} setBalance={setBalance}/>
      }
    </div>
  );
}

export default App;
