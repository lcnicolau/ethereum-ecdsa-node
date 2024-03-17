const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const process = require("child_process");

app.use(cors());
app.use(express.json());

const balances = {};

app.get("/welcome/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 100;
  balances[address] = balance;
  res.send({ balance });
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] = balances[recipient] || 0;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
  process.fork('generate.js', [3]);
});