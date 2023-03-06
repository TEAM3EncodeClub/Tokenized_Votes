import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

const MINT_VALUE = 100;

async function main() {

  // Deploy ERC20Votes Contract
  const provider = new ethers.providers.InfuraProvider(
      "maticmum",
      process.env.INFURA_API_KEY
  );
  //const provider = new ethers.providers.InfuraProvider(
  //    "goerli",
  //    process.env.INFURA_API_KEY
  //);

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
  const contractERC20Votes = await contractERC20VotesFactory.deploy();
  const deployedTransactionReciptERC20 = await contractERC20Votes.deployTransaction.wait();
  console.log(
    `the ERC20Votes contract was deployed at the address ${contractERC20Votes.address}` 
  );

  console.log(`The ERC20Votes contract got deployed at block number ${deployedTransactionReciptERC20.blockNumber}`);


  
  //const [deployer, account1, account2, account3] = await ethers.getSigners();

  // TEAM 3 Addresses
  const addresses = [
    "0x934a406B7CAB0D8cB3aD201f0cdcA6a7855F43b0", // Davids
    "0xD64258a33E7AC0294a9fdE8e4C9A76674bD33A23",
    "0xDDd93CEC5843f471Eb2b8B2886b2Be32555B5209"
  ]

  // GIVE VOTE TOKENS
  console.log("GIVE VOTE TOKENS:");

  //Mint some tokens to Account 1 
  const mintTx = await contractERC20Votes.mint(addresses[0], MINT_VALUE);
  const mintRecipt = await mintTx.wait();
  console.log(`Minted tokens to ${addresses[0]} at ${mintRecipt.blockNumber}`);
  const balanceOfAccount1 = await contractERC20Votes.balanceOf(addresses[0]);
  console.log(`Now the balance of ${addresses[0]} is ${balanceOfAccount1}`);
  
  //Mint some tokens to Account 2
  const mintTx2 = await contractERC20Votes.mint(addresses[1], MINT_VALUE);
  const mint2Recipt = await mintTx2.wait();
  console.log(`Minted tokens to ${addresses[1]} at ${mint2Recipt.blockNumber}`);
  const balanceOfAccount2 = await contractERC20Votes.balanceOf(addresses[1]);
  console.log(`Now the balance of ${addresses[1]} is ${balanceOfAccount2}`);

  //Mint some tokens to Account 3
  const mintTx3 = await contractERC20Votes.mint(addresses[2], MINT_VALUE);
  const mint3Recipt = await mintTx3.wait();
  console.log(`Minted tokens to ${addresses[2]} at ${mint3Recipt.blockNumber}`);
  const balanceOfAccount3 = await contractERC20Votes.balanceOf(addresses[2]);
  console.log(`Now the balance of ${addresses[2]} is ${balanceOfAccount3}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})
