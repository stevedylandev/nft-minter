import { DefenderRelayProvider } from "defender-relay-client/lib/web3"
import Web3 from "web3"
import abi from "../../utils/abi.json"
import formidable from "formidable";
import fs from "fs";
const pinataSDK = require("@pinata/sdk");

const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });
const credentials = { apiKey: `${process.env.NEXT_PUBLIC_DEFENDER_KEY}`, apiSecret: `${process.env.NEXT_PUBLIC_DEFENDER_SECRET_KEY}` }
const provider = new DefenderRelayProvider(credentials, { speed: 'fast' });
//const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
const web3 = new Web3(provider)

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFile = async (file) => {
  try {
    const stream = fs.createReadStream(file.filepath);
    const options = {
      pinataMetadata: {
        name: file.originalFilename,
      },
    };
    const response = await pinata.pinFileToIPFS(stream, options);
    fs.unlinkSync(file.filepath);

    return response;
  } catch (error) {
    throw error;
  }
};



export default async function handler(req, res) {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async function(err, fields, files) {
      const { file, walletAddress, name, description, externalURL } = fields;
      if (err) {
        console.log({ err });
        return res.status(500).send("Upload Error");
      }
      const fileUploadRes = await saveFile(files.file);
      const { IpfsHash } = fileUploadRes;

      const body = {
        name: name,
        description: description,
        image: `ipfs://${IpfsHash}`,
        external_url: externalURL,
      };

      const metadataUploadRes = await pinata.pinJSONToIPFS(body);
      const { IpfsHash: metadataHash } = metadataUploadRes;

      const address = walletAddress.toString()
      const uri = `https://discordpinnie.mypinata.cloud/ipfs/${metadataHash}`
      console.log(address, uri)

      const [from] = await web3.eth.getAccounts()
      const contract = new web3.eth.Contract(abi.output.abi, contractAddress, { from })
      const mintTxn = await contract.methods.safeMint(address, uri).send()
      console.log(mintTxn)
      res.status(200).json({ mintTxn })
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ text: "Error minting NFT", error: error })
  }
}

