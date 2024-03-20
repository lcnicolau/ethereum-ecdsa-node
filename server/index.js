const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const process = require("child_process");

app.use(cors());
app.use(express.json());

const balances = {};
const history = {};

app.get("/welcome/:address", (req, res) => {
  const { address } = req.params;
  balances[address] = balances[address] || 100;
  history[address] = history[address] || [];
  res.send({ balance: balances[address] });
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  res.send({ balance: balances[address] || 0 });
});

app.get("/history/:address", (req, res) => {
  const { address } = req.params;
  res.send({ count: (history[address] || []).length });
});

app.post("/send", (req, res) => {
  const { transaction, signature } = req.body;

  const { from, to, value, nonce } = transaction;
  const data = JSON.stringify(transaction);
  const hash = keccak256(utf8ToBytes(data));

  const { r, s, recovery } = signature;
  const sig = new secp256k1.Signature(BigInt(r), BigInt(s), recovery);

  const publicKey = sig.recoverPublicKey(hash).toRawBytes(compressed = false);
  const pkHash = keccak256(publicKey.slice(1)).slice(-20);
  const address = '0x' + toHex(pkHash);

  if (address !== from) {
    res.status(400).send({ message: "Sender address does not match" });
  } else if (secp256k1.verify(sig, hash, publicKey) !== true) {
    res.status(400).send({ message: "Invalid signature" });
  } else if (nonce !== (history[from] || []).length) {
    res.status(400).send({ message: "Invalid nonce" });
  } else if (balances[from] < value) {
    res.status(400).send({ message: "Not enough funds" });
  } else {
    balances[from] -= value;
    balances[to] = balances[to] || 0;
    balances[to] += value;
    history[from] = history[from] || [];
    history[from].push(transaction);
    res.send({ balance: balances[from] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
  process.fork('generate.js', [3]);
});