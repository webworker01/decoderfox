const config = require('./config');

const crypto = require('crypto');

const Web3 = require('web3');
const web3provider = new Web3.providers.HttpProvider(config.eth.nodeurl);
const web3 = new Web3(web3provider);
const bignum = require('bignum');
const bs58 = require('bs58')

const InputDataDecoder = require('./lib/inputdatadecoder');
const decoder = new InputDataDecoder('./tokenabi.json');

const ethDecimals = 1000000000000000000;

var deployeraddress = '0xdb708e2b290057cdfbea2d1ba450c6598abbcd37';
var swapcontract = '0xd82f7e3956d3ff391c927cd7d0a7a57c360df5b9';
var tokencontract = '0xa1d6df714f91debf4e0802a542e13067f31b8262';
var oldcontracts = ['0xca6f2a9c0c55082edc59533306669ffe64a38c03', '0x66b6440126e76f94549a2267831727a76d90f1d4'];

// https://etherscan.io/txs?a=0xdb708e2b290057cdfbea2d1ba450c6598abbcd37
var alltransactions = [
  // '0xee9d046464bc03f0116c245918ecd48327d9ad5d1ffc1fe4b0177a99af6e8d95', // eth deposit
  // '0xb330572e0ebb9db7b277a3a40f841528514167bf7281a86eeb1c65efb7e767e2', // old contracts
  // '0x5f1e79246dac3b9afade2735e1b5cd001b86ba9ea4e74ce30f42573d170a2aac', // old contracts
  // '0x1d2a11159dc147df770045f4f1e896be3468a78a7fb44fd66790ada00e15e039', // old contracts
  // '0x6251c77dcd0949cc48a71177b2d846f4a9d76c73406edb6e955ab3017790fa5b', // old contracts
  // '0x27bcdbfa79a797cc9dc93f534bb99e682b98d739e30e28c09997ea8245e0371d', // old contracts
  // '0xb8c6041957285021521d62b3fd3496d6c72072d9d18da1b26fb2e0057d821aad', // eth deposit
  // '0x441de674e41785f758544cd4a26806403386ef0201193515fa35ffd556eac161', // old contracts
  '0x68f6911dc474de90215a8fe67516f50c81af9784c3e3fbea8cf1ec0f022e5112',    // create contract RedFoxMigration
  '0xa412e13e07f7f6cf6b983a2e8b5c5a0c4c38f75bf918e89f933a8d71e979570f',    // create contract RedFox Labs: RFOX Token
  '0x53dfc9b1cb8f5d24606f63ad1179308c497d34355f00a35ac139625567bf97d7',    // setTokenContract (links migration contract to ecr20 token)
  '0x751111109d3145bf4e1128827ab0d4ed1e0461e15ec14e968dfa389ea2d8edda',    // snapshot
  '0xe81d4efe11a31cd1e043e1719c324a32f1bb3d19b5815c56df14014893ec7029',    // snapshot
  '0xb0506f5ce5dd7d9e3be0e768e2c595308d4c7ed66c27bbacd1727175370ab670',    // snapshot
  '0xdaf71f05b49ab56310f2db3dc82395c629717018868c9b6b325170e3ced46030',    // snapshot
  // '0xce6eb82da1718097cbe2fc503dcf2889e1fa16422afd6005bb375f87082ef2e8', // eth deposit
  '0xa7afa9d3465ed689f93b3a0722eb598a867fa70022aca8c2522a336b3d4dad34',    // snapshot
  '0x5c1157230e2c030ec10e80b9d90c9e811ae4841903aec6e64beecc72b6b7aa4f',    // timelocked coins (50,000,000  - over 4 tx)
  '0xb56fa3dce8d38a9a357089726613f2d7ae1a4225d3cb8698e862e5f9ae2a0e69',    // timelocked coins (350,000,000 - 7m per month)
  '0x1258959c881d881a96e6106f8f24d3327a21e21407c75e847ba0d4aaf5979813',    // timelocked coins (250,000,000 - over 3 tx)
  '0xa54b2fdff5194856d755c2e247ab6f68df91fa2e2ecc087a5fc63b969fbf196f',    // finalizeImport
  // '0xc1ee22fb92278458da1944f8d650d38be26fbbab83e9f90f5ada8dd9171ed402', // eth withdraw
  // '0xfdff61f6b10f6aa0d015554b00f64cda8b3f1997c50aabb28c4db0b18db453d0', // eth deposit
  // '0x09ddef27b9db576770f5317d99015f6e04a6b3b65f72a41a9c92533531e11444', // transfer 500 rfox
  // '0xf4e6ea6bb513bb39b66cc8560b52ee3dbb9e9e61c592d2bd1579c4309ebcae68', // eth deposit
  // '0x97fa0641fb672b9fd7dcad02f238e2848f52660ac60847a80a72c030b651dfb1', // eth withdraw
  // '0x8324c1a1dba3d6ce4881a95f95dccc0a1edb7a077e378aa0f3d9f04e05ed3d02', // eth deposit
  // '0x0e459411280a0c9fa31d1ca569940d4655fed144def8a86006474d43f68a3676', // approve for trading on uniswap
  // '0x1e7414983a0a982df080484b18d3ab5254505d6938734e34616b9e7b9aa1e2ba', // other tx
  // '0xf47a22edea20158b16303e2d0e674d8d2cc92a8c2c8bac1258cf7c164ffa89ee', // eth deposit
  // '0xbd8533efcee39eef7d068187ca8b50af67549e9bc3f6ac83afd4ac9de2e1091a', // eth withdraw
  // '0xda8a82095243644d769dba922017473d8826a8e6194fb4a0985aac2634f50116', // other tx
  // '0x150ad8d7f833b4d1b541ee2baffef4e74dcdc1b1367b0d96118aa54451cad9ca', // other tx
  // '0x6cc760e53d8b77e446e1c9628d07a19187f34d776520f8c644b18cf3fe6ba775', // other tx
  // '0xdc8f8df15f43f52e008121a5b950983010228adb043d01a9c1c3512afd143838'  // other tx
];

function hash160ToKMD(hash160) {
  var hash160Buf = new Buffer(hash160.replace('0x', ''), 'hex');
  var version = new Buffer('3c', 'hex'); // komodo prefix
  var hash = Buffer.concat([version, hash160Buf]);
  var checksum = crypto.createHash('sha256').update(crypto.createHash('sha256').update(hash).digest()).digest();
  var bytes = Buffer.concat([hash, checksum.slice(0, 4)]);
  return bs58.encode(bytes);
}

// Import tx inputs and format for caching to file txinputs.js
let parseTransactions = async function(alltransactions) {
  for (let txHash of alltransactions) {
    await web3.eth.getTransaction(txHash, (error, txResult) => {
      console.log('TX: ' + txHash);

      if (!txResult['to']) {
        console.log('Contract Creation');

      } else if (txResult['to'].toLowerCase() == deployeraddress) {
        console.log('Eth In: ' + txResult.value / ethDecimals)

      } else if (txResult.input == '0x') {
        console.log('Eth Out: ' + txResult.value / ethDecimals)

      } else if (oldcontracts.indexOf(txResult['to'].toLowerCase()) != -1) {
        console.log('Old Contract');

      } else if (txResult['to'].toLowerCase() == tokencontract) {
        console.log('RFOX Token Contract Interaction');

      } else if (txResult['to'].toLowerCase() == swapcontract) {
        resultArray = decoder.decodeData(txResult['input']);
        let method = resultArray['method'];
        console.log(method);

        if (method == "setRAccountBalances") {
          if (Array.isArray(resultArray.inputs)) {
            resultArray.inputs.forEach(input => {
              if (Array.isArray(input)) {
                console.log('account - blockHeight - amount - paid');
                input.forEach(inone => {
                  console.log(hash160ToKMD(inone[0]) + ' ' + bignum(inone[1][0][0]) + ' ' + bignum(inone[1][0][1]) / ethDecimals + ' ' + inone[1][0][2]);
                });
              }
            });
          }
        } else if (method == "setEthAccountBalance") {
            console.log('ethAddress: ' + resultArray['inputs'][0]);
            console.log('blockHeight - amount - paid');
            if (Array.isArray(resultArray.inputs[1])) {
              resultArray.inputs[1].forEach(input => {
                console.log(bignum(input[0]) + ' ' + bignum(input[1]) / ethDecimals + ' ' + input[2]);
              });
            }

        } else if (['finalizeImport', 'setTokenContract'].indexOf(method) == -1) {
          console.log(txResult);
        }

      } else {
        console.log('other tx');
      }

      console.log('----------------------------------------------------------------------');
    });
  }
}

parseTransactions(alltransactions);
