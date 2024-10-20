import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import wallet from "../cluster1/wallet/wba-wallet.json";
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

const name = "My Rug - genXR";
const symbol = "GXR";
const uri = "https://devnet.irys.xyz/GBSkxzULRT6BG9ARWaH6E19JcekoRqMttuTL44kJDTc6";

(async () => {
    let tx = createNft(umi, {
        mint, 
        name,
        symbol,
        uri,
        sellerFeeBasisPoints: percentAmount(5),
    });
    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
})();

// https://explorer.solana.com/tx/62FXeXuYWdtXoB6DVbXNYSeD6KVp78DmMdzSeBf2Nfuw7a7kRY4tFNYL5Zaq3qfxq4HRwWiYPxpvk3jCr3t1M9T8?cluster=devnet
// Mint Address:  631N92hYhoDvayx2xpyZHZSRY8z8C4ZPZx16APi92WxM