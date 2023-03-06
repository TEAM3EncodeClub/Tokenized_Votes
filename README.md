# TokensBallot and ERC20Votes Weekend Project 3

## Tasks 

* Form groups of 3 to 5 students
* Complete the contracts together
* Develop and run scripts for “TokenizedBallot.sol” within your group to give voting tokens, delegating voting power, casting votes, checking vote power and querying results
* Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed
* Share your code in a github repo in the submission form

## Script Code (scripts/TokenizedBallot.ts): 
The following script code performs the Weekend Project Tasks

```typescript 
import { ethers } from "hardhat";
import { MyToken__factory, Ballot__factory } from "../typechain-types";

const MINT_VALUE = 100;


// I Like Pokemons which one should I pick?
const PROPOSALS = ["Bulbasaur", "Charmander", "Squirtle", "pikachu"];

// Converts convert String Array to Bytes32 Array
function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

// Converts convert Bytes32 Array to String Array
function convertBytes32ArrayToString(array: Bytes32[]) {
  const stringArray = [];
  for (let index = 0; index < array.length; index++) {
    stringArray.push(ethers.utils.parseBytes32String(array[index]));
  }
  return stringArray;
}

async function main() {

  // Deploy ERC20Votes Contract
  const [deployer, account1, account2, account3] = await ethers.getSigners();
  const contractERC20VotesFactory = new MyToken__factory(deployer);
  const contractERC20Votes = await contractERC20VotesFactory.deploy();
  const deployedTransactionReciptERC20 = await contractERC20Votes.deployTransaction.wait();

  console.log(`The ERC20Votes contract got deployed at block number ${deployedTransactionReciptERC20.blockNumber}`);

  // GIVE VOTE TOKENS
  console.log("GIVE VOTE TOKENS:");

  //Mint some tokens to Account 1 
  const mintTx = await contractERC20Votes.mint(account1.address, MINT_VALUE);
  const mintRecipt = await mintTx.wait();
  console.log(`Minted tokens to ${account1.address} at ${mintRecipt.blockNumber}`);
  const balanceOfAccount1 = await contractERC20Votes.balanceOf(account1.address);
  console.log(`Now the balance of ${account1.address} is ${balanceOfAccount1}`);
  
  //Mint some tokens to Account 2
  const mintTx2 = await contractERC20Votes.mint(account2.address, MINT_VALUE);
  const mint2Recipt = await mintTx2.wait();
  console.log(`Minted tokens to ${account2.address} at ${mint2Recipt.blockNumber}`);
  const balanceOfAccount2 = await contractERC20Votes.balanceOf(account2.address);
  console.log(`Now the balance of ${account2.address} is ${balanceOfAccount2}`);

  //Mint some tokens to Account 3
  const mintTx3 = await contractERC20Votes.mint(account3.address, MINT_VALUE);
  const mint3Recipt = await mintTx3.wait();
  console.log(`Minted tokens to ${account3.address} at ${mint3Recipt.blockNumber}`);
  const balanceOfAccount3 = await contractERC20Votes.balanceOf(account3.address);
  console.log(`Now the balance of ${account3.address} is ${balanceOfAccount3}`);
  
  // DELEGATING VOTING POWER

  console.log("DELEGATING VOTING POWER");

  //First account1 self delegates
  const delegateTx = await contractERC20Votes.connect(account1).delegate(account1.address);
  const delegateTxRecipt = await delegateTx.wait();
  console.log(
    `tokens delegated from ${account1.address} to ${account1.address} at block ${delegateTxRecipt.blockNumber}`
  );
  let votingPower = await contractERC20Votes.getVotes(account1.address);
  console.log(
    `wallet ${account1.address} has a voting power of ${votingPower}`
  );

  //First account2 delegates
  const delegateTx2 = await contractERC20Votes.connect(account2).delegate(account3.address);
  const delegateTx2Recipt = await delegateTx2.wait();
  console.log(
    `tokens delegated from ${account2.address} to ${account3.address} at block ${delegateTx2Recipt.blockNumber}`
  );
  let votingPower2 = await contractERC20Votes.getVotes(account2.address);
  console.log(
    `wallet ${account2.address} has a voting power of ${votingPower2}`
  );

  //First account3 delegates
  const delegateTx3 = await contractERC20Votes.connect(account3).delegate(account3.address);
  const delegateTx3Recipt = await delegateTx3.wait();
  console.log(
    `tokens delegated from ${account3.address} to ${account3.address} at block ${delegateTx3Recipt.blockNumber}`
  );
  let votingPower3 = await contractERC20Votes.getVotes(account3.address);
  console.log(
    `wallet ${account3.address} has a voting power of ${votingPower3}`
  );

  // CASTING VOTES
  console.log("CASTING VOTES");

  // Deploy TokenizedBallot Contract
  const contractBallotFactory = new Ballot__factory(deployer);
  const contractBallot = await contractBallotFactory.deploy(
    convertStringArrayToBytes32(PROPOSALS),
    contractERC20Votes.address,
    "7"
  );
  const deployedTransactionReciptBallot = await contractBallot.deployTransaction.wait();

  console.log(`The ballot contract address is ${deployedTransactionReciptBallot.contractAddress}`);
  console.log(`The block number is ${deployedTransactionReciptBallot.blockNumber}`);

  // Account1 Votes for Bulbasaur with 49 tokens and votes 51 for Charmander
  const vote1Tx = await contractBallot.connect(account1).vote( "0", "49");
  const vote1Recipt = await vote1Tx.wait();
  console.log(
  `${account1.address} voted at block ${vote1Recipt.blockNumber} with the txID ${vote1Recipt.transactionHash}`
  );
  let votingPower1 = await contractBallot.votingPower(account1.address);
  console.log(
    `wallet ${account1.address} has a voting power of ${votingPower1}`
  );
  const vote2Tx = await contractBallot.connect(account1).vote( "0", "51");
  const vote2Recipt = await vote2Tx.wait();
  console.log(
  `${account1.address} voted at block ${vote2Recipt.blockNumber} with the txID ${vote2Recipt.transactionHash}`
  );
  votingPower1 = await contractBallot.votingPower(account1.address);
  console.log(
    `wallet ${account1.address} has a voting power of ${votingPower1}`
  );

  // Account2 tries to give 100 to Squirtle (for testscript Gets "Transaction reverted without a reason string")
  // ToDO: Add an error string to the Vote Functiont at the ballot contract (require).
  //const vote3Tx = await contractBallot.connect(account2).vote( "2", "100");
  //const vote3Recipt = await vote3Tx.wait();
  //console.log(vote3Recipt);

  // Account3 tries to give 100 to Squirtle (for testscript Gets "Transaction reverted without a reason string")
  const vote3Tx = await contractBallot.connect(account3).vote( "2", "51");
  const vote3Recipt = await vote3Tx.wait();
  console.log(
  `${account3.address} voted at block ${vote3Recipt.blockNumber} with the txID ${vote3Recipt.transactionHash}`
  );
  votingPower3 = await contractBallot.votingPower(account3.address);
  console.log(
    `wallet ${account3.address} has a voting power of ${votingPower3}`
  );
  const vote4Tx = await contractBallot.connect(account3).vote( "3", "101");
  const vote4Recipt = await vote4Tx.wait();
  console.log(
  `${account3.address} voted at block ${vote4Recipt.blockNumber} with the txID ${vote4Recipt.transactionHash}`
  );
  votingPower3 = await contractBallot.votingPower(account3.address);
  console.log(
    `wallet ${account3.address} has a voting power of ${votingPower3}`
  );

  // CHECK VOTE POWER
  console.log("CHECK VOTE POWER");

  //Check Account1 voting Power
  votingPower1 = await contractBallot.votingPower(account1.address);
  console.log(
    `wallet ${account1.address} has a voting power of ${votingPower1}`
  );


  //Check Account2 voting Power
  votingPower2 = await contractBallot.votingPower(account2.address);
  console.log(
    `wallet ${account2.address} has a voting power of ${votingPower2}`
  );

  ////Check Account3 voting Power
  votingPower3 = await contractBallot.votingPower(account3.address);
  console.log(
    `wallet ${account3.address} has a voting power of ${votingPower3}`
  );

  // QUERIYING RESUTS

  const winningProposal = await contractBallot.winningProposal();
  const winningProposalName = convertBytes32ArrayToString([await contractBallot.winnerName()]);
  console.log(` The Winner Proporsal is ${winningProposal}: ${winningProposalName} `)

} 

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})

```

## Output:
The following is this script  output performing the Project Tasks

```shell
$ yarn hardhat run scripts/TokenizedBallot.ts
The ERC20Votes contract got deployed at block number 1
GIVE VOTE TOKENS:
Minted tokens to 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 at 2
Now the balance of 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 is 100
Minted tokens to 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC at 3
Now the balance of 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC is 100
Minted tokens to 0x90F79bf6EB2c4f870365E785982E1f101E93b906 at 4
Now the balance of 0x90F79bf6EB2c4f870365E785982E1f101E93b906 is 100
DELEGATING VOTING POWER
tokens delegated from 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 to 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 at block 5
wallet 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 has a voting power of 100
tokens delegated from 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC to 0x90F79bf6EB2c4f870365E785982E1f101E93b906 at block 6
wallet 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC has a voting power of 0
tokens delegated from 0x90F79bf6EB2c4f870365E785982E1f101E93b906 to 0x90F79bf6EB2c4f870365E785982E1f101E93b906 at block 7
wallet 0x90F79bf6EB2c4f870365E785982E1f101E93b906 has a voting power of 200
CASTING VOTES
The ballot contract address is 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
The block number is 8
0x70997970C51812dc3A010C7d01b50e0d17dc79C8 voted at block 9 with the txID 0xf4efd1513536cf8e1c5bb1b87e414aa09f3d1aac2fd92deb8b8b96083097c22a
wallet 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 has a voting power of 51
0x70997970C51812dc3A010C7d01b50e0d17dc79C8 voted at block 10 with the txID 0x68de52eab6d9a2902a37c2e5ee9e98472838f72e674ca5b570b451592aae5213
wallet 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 has a voting power of 0
0x90F79bf6EB2c4f870365E785982E1f101E93b906 voted at block 11 with the txID 0xcca725fc1eb115da30ccc69d1237e1a36197c645403991e613fd085716f0d45b
wallet 0x90F79bf6EB2c4f870365E785982E1f101E93b906 has a voting power of 149
0x90F79bf6EB2c4f870365E785982E1f101E93b906 voted at block 12 with the txID 0x02a6b71d2bb55cb681a234455dae6412c547792302f32f8356018e279976b300
wallet 0x90F79bf6EB2c4f870365E785982E1f101E93b906 has a voting power of 48
CHECK VOTE POWER
wallet 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 has a voting power of 0
wallet 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC has a voting power of 0
wallet 0x90F79bf6EB2c4f870365E785982E1f101E93b906 has a voting power of 48
 The Winner Proporsal is 3: pikachu 
```

## Conclusions
Since there where multiple errors at the Goerli network as reported issue at the Lesson - 12 [1], I was unable to
perform this test on the testnet, yet at the end I foundout mumbai network let me do the deployment correctly.
We might require to do self delegation with the team coordination to forefill the tasks at the testnet and 
for new the task was forefilled successfully at the testing enviorment.
 
## Contact and Developers

- [David E. Perez Negron R.](mailto:david@neetsec.com) Github: @P1R

## References

\[1\] Encode Club Solidity Bootcamp , "Lesson 12 - Tokenized Votes", https://github.com/Encode-Club-Solidity-Bootcamp/Lesson-12, 2023.
\[2\] docs.soliditylang.org , "Solidity by Example", https://docs.soliditylang.org/en/latest/solidity-by-example.html#voting, 2023.
\[3\] docs.openzeppelin.com , "ERC20Votes", https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes, 2023.

https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes
