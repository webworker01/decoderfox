# decoderfox

## Instructions

```
git clone https://github.com/webworker01/decoderfox.git
cd ./decoderfox
npm update
npm start
```

## Information

Swap Contract https://etherscan.io/address/0xd82f7e3956d3ff391c927cd7d0a7a57c360df5b9#code

[Swap Contract Source](./contract.sol#L807)

Contract Deployer https://etherscan.io/address/0xdb708e2b290057cdfbea2d1ba450c6598abbcd37

Snapshot Transactions 

https://etherscan.io/tx/0x751111109d3145bf4e1128827ab0d4ed1e0461e15ec14e968dfa389ea2d8edda
https://etherscan.io/tx/0xe81d4efe11a31cd1e043e1719c324a32f1bb3d19b5815c56df14014893ec7029
https://etherscan.io/tx/0xb0506f5ce5dd7d9e3be0e768e2c595308d4c7ed66c27bbacd1727175370ab670
https://etherscan.io/tx/0xdaf71f05b49ab56310f2db3dc82395c629717018868c9b6b325170e3ced46030
https://etherscan.io/tx/0xa7afa9d3465ed689f93b3a0722eb598a867fa70022aca8c2522a336b3d4dad34

[Snapshot Balance Data](./balances.js) Need to decode this still. Each entry looks like:

```
balances.account	bytes20 0x96f66bf7bf05690436dd854eae8db31d9790f4b9
```

See index.js for attempts to decode.  [tokenabi.js](./tokenabi.js) has some of the data structures from
the contract. The contract itself should also provide useful context to figure this out. 

Seems the data is encoded in bytes20 format. Think we just need to figure out the abi format to pass into
simpleDecode, but not 100% sure. 

Obviously wrong e.g.

```
var decoded = abi.simpleDecode("balanceOf(address):(uint256)", balancedata)
```

Outputs:

```
0x6f52614cb92b7159e5182fa8d58950b7035503bb
[
  BN {
    negative: 0,
    words: [
       3749168, 35196238,
      52848147, 13944032,
      20265317,  9997772,
      37102483, 14206161,
      40252722,   794125,
             0
    ],
    length: 10,
    red: null
  }
]
```