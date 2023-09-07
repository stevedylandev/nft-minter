import { v4 as uuidv4 } from 'uuid';

const pinataJWT = process.env.PINATA_JWT

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const data = JSON.stringify({
        recipient: `polygon:${req.body.address}`,
        metadata: req.body.uri,
      })

      const mintRes = await fetch(`https://www.crossmint.com/api/2022-06-09/collections/${process.env.CROSSMINT_COLLECTION_ID}/nfts`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'x-client-secret': `${process.env.CROSSMINT_CLIENT_SECRET}`,
          'x-project-id': `${process.env.CROSSMINT_PROJECT_ID}`
        },
        body: data
      })

      const mintResJson = await mintRes.json()

      await delay(20000);


      const mintStatus = await fetch(`https://www.crossmint.com/api/2022-06-09/collections/${process.env.CROSSMINT_COLLECTION_ID}/nfts/${mintResJson.id}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-client-secret': `${process.env.CROSSMINT_CLIENT_SECRET}`,
          'x-project-id': `${process.env.CROSSMINT_PROJECT_ID}`
        }
      })

      const mintStatusJson = await mintStatus.json()

      res.status(200).json(mintStatusJson)
      console.log(mintStatusJson)
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

