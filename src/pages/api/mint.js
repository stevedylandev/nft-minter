import { DefenderRelayProvider } from "defender-relay-client/lib/web3"
import Web3 from "web3"
import abi from "../../utils/abi.json"

const credentials = {apiKey: `${process.env.NEXT_PUBLIC_DEFENDER_KEY}`, apiSecret: `${process.env.NEXT_PUBLIC_DEFENDER_SECRET_KEY}`}
const provider = new DefenderRelayProvider(credentials, { speed: 'fast' });
//const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
const web3 = new Web3(provider)

export default async function handler(req, res) {
  try {
  const address = req.body.walletAddress.toString()
  const uri = req.body.uri.toString()
  console.log(address, uri)

  const [from] = await web3.eth.getAccounts()
  const contract = new web3.eth.Contract(abi.output.abi, contractAddress, { from })
  const mintTxn = await contract.methods.safeMint(address, uri).send()
  console.log(mintTxn)

  res.status(200).json({ mintTxn })
  } catch (error) {
    console.log(error)
    res.status(500).json({ text: "Error minting NFT", error: error })
  }
}

