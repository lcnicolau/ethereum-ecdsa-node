const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

console.warn("=======================================================");
console.warn("          WARNING: for testing purposes only           ");
console.warn("=======================================================");

const args = process.argv.slice(2);
const n = parseInt(args[0] || 1);

for (let i = 0; i < n; i++) {
  const privateKey = secp256k1.utils.randomPrivateKey();
  console.log('private key:  ', toHex(privateKey));

  const publicKey = secp256k1.getPublicKey(privateKey, false);
  console.log('public key :', toHex(publicKey));

  const compressed = secp256k1.getPublicKey(privateKey);
  console.log('compressed :', toHex(compressed));

  const address = keccak256(publicKey.slice(1)).slice(-20);
  console.log('address    :', '0x' + toHex(address));

  console.log("             ------------------------------------------");
}