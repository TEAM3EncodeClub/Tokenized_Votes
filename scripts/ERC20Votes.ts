import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

const MINT_VALUE = 100;

async function main() {
  const [deployer, account1, account2] = await ethers.getSigners();
  const contractFactory = new MyToken__factory(deployer);
  const contract = await contractFactory.deploy();
  const deployedTransactionRecipt = await contract.deployTransaction.wait();

  console.log(`The block number is ${deployedTransactionRecipt.blockNumber}`);
  
  //Mint some tokens to Account 1 
  const mintTx = await contract.mint(account1.address, MINT_VALUE);
  const mintRecipt = await mintTx.wait();
  console.log(`Minted tokens to ${account1.address} at ${mintRecipt.blockNumber}`) 
  const balanceOfAccount1 = await contract.balanceOf(account1.address);
  console.log(`Now the balance of ${account1.address} is ${balanceOfAccount1}`)
  
  //Mint some tokens to Account 2
  const mintTx2 = await contract.mint(account2.address, MINT_VALUE);
  const mint2Recipt = await mintTx2.wait();
  console.log(`Minted tokens to ${account2.address} at ${mint2Recipt.blockNumber}`);
  const balanceOfAccount2 = await contract.balanceOf(account2.address);
  console.log(`Now the balance of ${account2.address} is ${balanceOfAccount2}`);

  //Check the Voting Power
  //First account1 self delegates
  const delegateTx = await contract.connect(account1).delegate(account1.address);
  const delegateTxRecipt = await delegateTx.wait();
  console.log(
    `tokens delegated from ${account1.address} to ${account1.address} at block ${delegateTxRecipt.blockNumber}`
  );
  const votingPower = await contract.getVotes(account1.address);
  console.log(
    `wallet ${account1.address} has a voting power of ${votingPower}`
  );
  console.log(
    `wallet ${account1.address} has a voting power of ${ethers.utils.formatEther(votingPower)}`
  );
 
  
  

  
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})
