import wallet from "../cluster1/wallet/wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = 'https://devnet.irys.xyz/8KUvBJohDCU6L2hthkSHuyvaGhBfnmZbXLtk6Any5vHj';
        const metedata = {
            name: "My Rug - genXR",
            symbol: "GXR",
            description: "PurpplyXyou",
            image: image,
            attributes: [
                {trait_type: 'color', value: 'Purple'},
                {trait_type: 'size', value: 'small'},
                {trait_type: 'Chip', value: 'XRare'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ]
            },
            creators: [
                {
                    address : keypair.publicKey,
                    shares : 666,
                }
            ],
        };

        const uploadedMetadata = await umi.uploader.uploadJson(metedata);

        console.log("Your metadata URI: ", uploadedMetadata.replace("arweave.net", "devnet.irys.xyz"));

    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();

// Your metadata URI:  https://devnet.irys.xyz/GBSkxzULRT6BG9ARWaH6E19JcekoRqMttuTL44kJDTc6