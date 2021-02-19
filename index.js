var abi = require('ethereumjs-abi')
var BN = require('bn.js')

var balances = require('./balances.js');
var tokenAbi = require('./tokenabi.js');

balances.forEach(balancedata => {
  console.log(balancedata);

  // var decoded = abi.simpleDecode("bytes20", balancedata)
  // var decoded = abi.decode(tokenAbi, "getRAccountBalances()", balancedata)
  var decoded = abi.rawDecode([ "bytes20",  "uint256", "uint256", "bool" ], balancedata);


  // var decoded = abi.simpleDecode("balanceOf(address):(uint256)", balancedata)
  // var decoded = abi.simpleDecode("balances.account(bytes20)", balancedata, "hex")
  console.log(decoded);
});