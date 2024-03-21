## ECDSA Node

This project is an example of using a client and server to facilitate transfers between different addresses. Since there is just a single server on the back-end handling transfers, this is clearly very centralized. We won't worry about distributed consensus for this project.

However, it actually uses Public Key Cryptography to sign the transactions, and then verifies the signature at the backend, using [Elliptic Curve Digital Signature Algorithm (ECDSA)](https://en.bitcoin.it/wiki/Elliptic_Curve_Digital_Signature_Algorithm) with [Ethereum Cryptography library](https://github.com/ethereum/js-ethereum-cryptography), very much like in real life.

### Implementation details

When you launch the backend, it will give you some randomly generated private/public key pairs along with the corresponding address (for testing purposes only), and you will be able to claim some coins to try out the app - for free!

> These are some useful resources on key generation:
> 
> - [How to generate your very own Bitcoin private key](https://www.freecodecamp.org/news/how-to-generate-your-very-own-bitcoin-private-key-7ad0f4936e6c/)
> - [How to create an Ethereum wallet address from a private key](https://www.freecodecamp.org/news/how-to-create-an-ethereum-wallet-address-from-a-private-key-ae72b0eee27b/)
> - [Ethereum checksummed addresses, importance, and implementation](https://medium.com/coinmonks/ethereum-checksummed-addresses-importance-and-implementation-eef74aa3ae18)
> - [Ethereum Tools Online](https://www.ethtools.online/)
>
> For simplicity, adding checksum was not considered during the address derivation process.

The frontend allows you to see the details of the public key and address derivation from the private key, as well as a preview of the payload that will be sent to the server (which you can check in the browser's DevTools to confirm that the primary key is not being sent). 

> In fact, there is a great opportunity for further learning by integrating this frontend with a real wallet like [Metamask](https://metamask.io/), to externally sign the transaction while keeping the private key secure.

A probably misunderstanding when studying the Blockchain Cryptography, is that you don't need to send your public key (or address) in the transaction body, because it can be recovered from the signature (via the recovery bit). 
 
However, you ([or someone in the middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)) can actually change the transaction data, and if you simply recover the public key from the signature and use it to verify the same signature, [it will indeed be verified](https://stackoverflow.com/q/78093360/4071001) (although you would have recovered a different public key). 

> So, [I ended up sending the address](https://stackoverflow.com/a/78201362/4071001) to be compared with the recovered form signature as part of the server validations. Please leave your vote if this is the right way, or let me know if there is a better way (I will gladly accept your answer).

Finally, we need to consider a particular challenge: what if someone intercepted a valid signature, would they be able to replay that transfer by sending it back to the server?

That is why before you can send a transaction, you have to query the server how many transactions have been sent from that address over time, which is actually the nonce you need for the next transaction (because it starts from 0).

> These are some useful resources on account nonce:
> 
> - [Ethereum Transactions](https://ethereum.org/developers/docs/transactions)
> - [The Account Nonce in Ethereum Explained](https://medium.com/coinmonks/the-account-nonce-in-ethereum-explained-c087bd4a3c29)

### Video instructions
For an overview of this project as well as getting started instructions, check out the following video:

https://www.loom.com/share/0d3c74890b8e44a5918c4cacb3f646c4
 
### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the depedencies 
3. Run `node index` to start the server 

The application should connect to the default server port (3042) automatically! 

_Hint_ - Use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node` to automatically restart the server on any changes.
