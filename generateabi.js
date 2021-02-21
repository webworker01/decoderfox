var solc = require('solc');
var fs = require('fs');

// getting the development snapshot
var solidityVersion = 'v0.6.6+commit.6c089d02';

solc.loadRemoteVersion(solidityVersion, function(err, solcSnapshot) {
  if (err) {
    // An error was encountered, display and quit
  } else {
    var contract = fs.readFileSync('contract.sol','utf8').toString();

    var input = {
      language: 'Solidity',
      sources: {
        'RedFoxMigration.sol': {
          content: contract
        }
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*']
          }
        }
      }
    };

    var output = JSON.parse(solcSnapshot.compile(JSON.stringify(input)));

    console.log(output);

    // `output` here contains the JSON output as specified in the documentation
    for (var contractName in output.contracts['RedFoxMigration.sol']) {
      console.log(
        contractName +
          ': ' +
          output.contracts['RedFoxMigration.sol'][contractName].evm.bytecode.object
      );
    }
  }
});
