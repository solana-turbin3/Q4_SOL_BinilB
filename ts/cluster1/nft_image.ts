import wallet from "../cluster1/wallet/wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        //1. Load image
        //2. Convert image to generic file.
        //3. Upload image

        const image = await readFile("D:/web3/solana-starter/ts/genXr.png");
        const genericFile = createGenericFile(image, 'My Rug', {contentType: 'image/png'});
        const [myUri] = await umi.uploader.upload([genericFile]);

        console.log("Your image URI: ", myUri.replace("arweave.net", "devnet.irys.xyz"));
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
//Your image URI:  https://devnet.irys.xyz/8KUvBJohDCU6L2hthkSHuyvaGhBfnmZbXLtk6Any5vHj