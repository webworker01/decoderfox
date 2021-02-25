const solc = require('solc');
const fs = require('fs');

// getting the development snapshot
const solidityVersion = 'v0.6.6+commit.6c089d02';

solc.loadRemoteVersion(solidityVersion, function(err, solcSnapshot) {
  if (err) {
    // An error was encountered, display and quit
  } else {
    const contractFileName = 'RedFoxMigration.sol';

    const contract = fs.readFileSync(contractFileName,'utf8').toString();

    let input = {
      language: 'Solidity',
      sources: {
        [contractFileName]: {
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

    let output = JSON.parse(solcSnapshot.compile(JSON.stringify(input)));

    console.log(output);

    // `output` here contains the JSON output as specified in the documentation
    for (let contractName in output.contracts[contractFileName]) {
      console.log(
        contractName +
          ': ' +
          output.contracts[contractFileName][contractName].evm.bytecode.object
      );
    }
  }
});
