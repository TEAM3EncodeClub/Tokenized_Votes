import { ethers } from "hardhat";
import { MyToken__factory, Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
import { Signer } from "ethers";
dotenv.config();


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
  const provider = new ethers.providers.InfuraProvider(
      "goerli",
      process.env.INFURA_API_KEY
  );

  console.log({ provider });
  const pkey = process.env.PRIVATE_KEY;
  console.log({ pkey });
  const lastBlock = await provider.getBlock("latest");
  console.log({ lastBlock });
  const wallet = new ethers.Wallet(`${pkey}`);
  const signer = wallet.connect(provider);

  // Deploy ERC20Votes Contract
  console.log("Deploying ERC20Votes contract");
  const contractERC20VotesFactory = await new MyToken__factory(signer);
  const contractERC20Votes = await contractERC20Votes.deploy();
  const deployedTransactionReciptERC20 = await contractERC20Votes.deployTransaction.wait();
  console.log(
    `the ERC20Votes contract was deployed at the address ${contractERC20Votes.address}` 
  );

  console.log(`The ERC20Votes contract got deployed at block number ${deployedTransactionReciptERC20.blockNumber}`);


  
  //const [deployer, account1, account2, account3] = await ethers.getSigners();

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
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  const ballotFactory = await new Ballot__factory(signer);
  const contractBallot = await ballotFactory.deploy(
    convertStringArrayToBytes32(PROPOSALS)
    contractERC20Votes.address,
   // "7"
  );
  const deployedTransactionReciptBallot = await contractBallot.deployTransaction.wait();
  console.log(
    `the Ballot contract was deployed at the address ${ballotContract.address}` 
  );

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
