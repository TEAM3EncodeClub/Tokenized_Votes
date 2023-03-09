const accounts = [
    "0xEFC0D955536ed993F93177bdaCdA5d266083F573", // Dan 
    "0xDDd93CEC5843f471Eb2b8B2886b2Be32555B5209", //  David
    "0xedd778B1Ad8131C2Ba9B9Fe3764fFfa26654e38F", //  Adam
    "0x002390240Cc451299300b8200e5bEDF5420699b6", // Rebecca
    "0x940029ebf6D0C4aaDE9c8bC118901701886B8664", //  Cesar
]

const contractAddress = "0x18dF1C9a5c9A7A35c251818Eec22ccaf3905fe3D";

async function main() {
    
  const tokenContractFactory = new MyToken__factory(signer);  // "signer" declared above with provider, wallet, ect.
  const tokenContract = tokenContractFactory.attach(contractAddress);
  
  //  mint tokens for all accounts
    for (let i = 0; i < accounts.length; i ++){
        let mintTx = await tokenContract.mint(accounts[i], MINT_VALUE);
        let mintTxReceipt = await mintTx.wait();
        let tokenBalance = await tokenContract.balanceOf(accounts[i]);
        console.log(`${ethers.utils.formatEther(tokenBalance)} 
        tokens minted for Account${i}: (${accounts[i]}) at block ${mintTxReceipt.blockNumber}`);
    };
