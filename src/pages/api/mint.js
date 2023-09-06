import { DefenderRelayProvider } from "defender-relay-client/lib/web3"
import Web3 from "web3"
import abi from "../../utils/abi.json"
import { v4 as uuidv4 } from 'uuid';

const credentials = { apiKey: `${process.env.NEXT_PUBLIC_DEFENDER_KEY}`, apiSecret: `${process.env.NEXT_PUBLIC_DEFENDER_SECRET_KEY}` }
const provider = new DefenderRelayProvider(credentials, { speed: 'fast' });
//const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
const web3 = new Web3(provider)
const pinataJWT = process.env.PINATA_JWT

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const address = req.body.walletAddress.toString()
      const uri = req.body.uri.toString()

      const [from] = await web3.eth.getAccounts()
      const contract = new web3.eth.Contract(abi.output.abi, contractAddress, { from })
      const mintTxn = await contract.methods.safeMint(address, uri).send()

      res.status(200).json({ mintTxn })
    } catch (error) {
      console.log(error)
      res.status(500).json({ text: "Error minting NFT", error: error })
    }
  } else if (req.method === "GET") {
    try {
      const uuid = uuidv4();
      const body = JSON.stringify({
        keyName: uuid.toString(),
        permissions: {
          admin: true
        },
        maxUses: 2
      })
      const keyRes = await fetch('https://api.pinata.cloud/users/generateApiKey', {
        method: 'POST',
        body: body,
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: `Bearer ${pinataJWT}`
        }
      })
      const keyResJson = await keyRes.json()
      const { JWT } = keyResJson
      return res.send(JWT)

    } catch (error) {
      console.log(error.message)
      res.status(500).json({ text: "Error creating API Key", error: error })
    }
  }
}

