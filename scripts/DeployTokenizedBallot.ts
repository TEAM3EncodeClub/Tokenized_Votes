import { ethers } from "hardhat";
import {  Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();


// Fill after everyone delegates
const TARGET_BLOCK_NUMBER = "";
// Fill after ERC20Votes Smart Contract Deploymenet
const ERC20VOTES_ADDRESS = "";


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

async function main() {

  // Deploy TokenizedBallot Contract

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

  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  const ballotFactory = await new Ballot__factory(signer);
  const contractBallot = await ballotFactory.deploy(
    convertStringArrayToBytes32(PROPOSALS),
    ERC20VOTES_ADDRESS,
    TARGET_BLOCK_NUMBER 
  );
  const deployedTransactionReciptBallot = await contractBallot.deployTransaction.wait();
  console.log(
    `the Ballot contract was deployed at the address ${contractBallot.address}` 
  );

  console.log(`The ballot contract address is ${deployedTransactionReciptBallot.contractAddress}`);
  console.log(`The block number is ${deployedTransactionReciptBallot.blockNumber}`);
} 

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})
