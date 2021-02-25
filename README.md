# decoderfox

## Instructions

Tested on node v14.16.0

```
git clone https://github.com/webworker01/decoderfox.git
cd ./decoderfox
cp config.example.js config.js
```
Edit config.js with your web3 endpoint.
```
npm update
npm start
```

## Information

ERC20 Token [(source)](./RedFoxToken.sol) https://etherscan.io/address/0xa1d6df714f91debf4e0802a542e13067f31b8262#code

Swap Contract [(source)](./RedFoxMigration.sol#L807) https://etherscan.io/address/0xd82f7e3956d3ff391c927cd7d0a7a57c360df5b9#code

Contract Deployer https://etherscan.io/address/0xdb708e2b290057cdfbea2d1ba450c6598abbcd37

[KMD based RFOX Richlist](https://dexstats.info/richlist.php?asset=rfox)

[Redfox Whitepaper](https://docsend.com/view/a2kfkrmgcmwvs2rq)

### Verus Mobile Swap Process
[Verus Mobile Claiming Code](https://github.com/VerusCoin/Verus-Mobile/blob/v0.2.0-beta-2/src/utils/api/channels/erc20/requests/specific/rfox/claimAccountBalance.js#L34-L54) calls [withdrawBalance contract function](https://github.com/webworker01/decoderfox/blob/main/RedFoxMigration.sol#L947-L969)

* The claiming code sends the `pubkey` to the contract and signs the transaction with the `privkey`.
* The smart contract code:
* * Looks up the `account` stored in the snapshot stored as hash160
* * Checks that it is not already paid and past the specified block height (as a timelock)
* * Transfers the tokens to the eth address that send the transaction and marks the account as paid

### Snapshot decoding
Snapshot Transactions:
* https://etherscan.io/tx/0x751111109d3145bf4e1128827ab0d4ed1e0461e15ec14e968dfa389ea2d8edda
* https://etherscan.io/tx/0xe81d4efe11a31cd1e043e1719c324a32f1bb3d19b5815c56df14014893ec7029
* https://etherscan.io/tx/0xb0506f5ce5dd7d9e3be0e768e2c595308d4c7ed66c27bbacd1727175370ab670
* https://etherscan.io/tx/0xdaf71f05b49ab56310f2db3dc82395c629717018868c9b6b325170e3ced46030
* https://etherscan.io/tx/0xa7afa9d3465ed689f93b3a0722eb598a867fa70022aca8c2522a336b3d4dad34

Each entry was passed into `setRAccountBalances(bytes20 account, tuple[uint256 blockHeight, uint256 amount, bool paid][])` and has this ABI format [see tokenabi.js](./tokenabi.js#L398-L436).

### Results

[Output of the script](./output.txt)