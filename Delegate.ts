import * as dotenv from "dotenv";
import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
dotenv.config();

//  fill tokenContractAddress with the deployed contract address.
const tokenContractAddress = "0xb018d08b73177b195f10033d677d9682f331132d";

// run the script: yarn run ts-node --files ./scripts/Delegate.ts "<private key>" "<address delegating to>"
async function main() {

    const args = process.argv;
    const pair= args.slice(2);
    if (pair.length <= 1){
        throw new Error("Paste your 1. private key, and 2. the address you are delegating votes to, separated by a space.");
    };
    const keyAndAddress: string[] = [];
    pair.forEach((element) => {
        keyAndAddress.push(element);
    });

    const provider = new ethers.providers.AlchemyProvider(
        "maticmum",
        process.env.ALCHEMY_API_KEY);
        
    const wallet = new ethers.Wallet(keyAndAddress[0]);
    const signer = wallet.connect(provider);

    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = tokenContractFactory.attach(tokenContractAddress);
    let delegatorVotes = await tokenContract.getVotes(signer.address);
    let delegateeVotes = await tokenContract.getVotes(keyAndAddress[1]);
    console.log(`The delegator had ${ethers.utils.formatEther(delegatorVotes)} votes`);
    console.log(`The delegatee had ${ethers.utils.formatEther(delegateeVotes)} votes`);
    const delegateTx = await tokenContract.delegate(keyAndAddress[1]);
    const delegateTxReceipt = await delegateTx.wait();
    delegatorVotes = await tokenContract.getVotes(signer.address);
    delegateeVotes = await tokenContract.getVotes(keyAndAddress[1]);
    console.log(`The delegator now has ${ethers.utils.formatEther(delegatorVotes)} votes`);
    console.log(`The delegatee now has ${ethers.utils.formatEther(delegateeVotes)} votes`);

};

main().catch((error) =>{
    console.error(error);
    process.exitCode = 1;
});
