import { useState } from 'react'
import axios from 'axios'
import styles from '@/styles/Form.module.css'
import RingLoader from "react-spinners/RingLoader"
import { usePrivy } from "@privy-io/react-auth"
import fireConfetti from "../../utils/confetti"

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

const Form = () => {
  const [selectedFile, setSelectedFile] = useState()
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [externalURL, setExternalURL] = useState()
  const [sendTo, setSendTo] = useState()
  const [osLink, setOsLink] = useState("https://opensea.io")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  const { ready, authenticated, user, logout } = usePrivy()
  const fileChangeHandler = (event) => {
    setSelectedFile(event.target.files[0])
  }
  const nameChangeHandler = (event) => {
    setName(event.target.value)
  }
  const descriptionChangeHandler = (event) => {
    setDescription(event.target.value)
  }
  const externalURLChangeHandler = (event) => {
    setExternalURL(event.target.value)
  }
  const sendToChangeHandler = (event) => {
    setSendTo(event.target.value)
  }

  const handleSubmission = async () => {
    setIsLoading(true)
    const tempKey = await axios.get("/api/mint")
    const key = tempKey.data
    const formData = new FormData()

    formData.append('file', selectedFile)

    const metadata = JSON.stringify({
      name: '${selectedFile}',
    })
    formData.append('pinataMetadata', metadata)

    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', options)

    try {
      setMessage("Uploading File...")
      const uploadRes = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          maxBodyLength: 'Infinity',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: `Bearer ${key}`,
          },
        }
      )
      const hash = uploadRes.data.IpfsHash

      const jsonData = JSON.stringify({
        name: name,
        description: description,
        image: `https://discordpinnie.mypinata.cloud/ipfs/${hash}`,
        external_url: externalURL
      })
      setMessage("Uploading Metadata...")
      const jsonRes = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", jsonData, {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
      })
      const uri = jsonRes.data.IpfsHash

      const mintBody = {
        walletAddress: ready ? user.wallet.address : sendTo,
        uri: `https://discordpinnie.mypinata.cloud/ipfs/${uri}`
      }

      setMessage("Minting NFT...")
      const mintRes = await axios.post("/api/mint", mintBody)

      setOsLink(`https://testnets.opensea.io/assets/goerli/${contractAddress}/${mintRes.data.mintTxn.events.Transfer.returnValues.tokenId}`)
      setMessage("Minting Complete!")
      setIsLoading(false)
      setIsComplete(true)
      fireConfetti()
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      setIsComplete(false)
      alert("Error Minting NFT")
    }
  }


  return (
    <div className={styles.form}>
      {!isLoading && !isComplete && (
        <>
          <label className={styles.formInput} onChange={fileChangeHandler} htmlFor="file">
            <input name="" type="file" id="file" hidden />
            <p>{!selectedFile ? "Select File" : `${selectedFile.name}`}</p>
          </label>
          <label>Name</label>
          <input type='text' placeholder='Cool NFT' onChange={nameChangeHandler} />
          <label>Description</label>
          <input
            type='text'
            placeholder='This NFT is just so cool'
            onChange={descriptionChangeHandler}
          />
          <label>Your Website</label>
          <input
            type='text'
            placeholder='https://pinata.cloud'
            onChange={externalURLChangeHandler}
          />
          {ready && authenticated && !user.wallet && (
            <>
              <label>Wallet Address</label>
              <input
                type='text'
                placeholder='0x...'
                onChange={sendToChangeHandler}
                defaultValue={ready && authenticated && user.wallet ? user.wallet.address : sendTo}
              />
            </>
          )}
          <button onClick={handleSubmission}>Submit</button>
          <button className={styles.logout} onClick={logout}>Logout</button>
        </>
      )}
      {isLoading && (
        <div className={styles.form}>
          <RingLoader
            loading={isLoading}
            size={200}
            aria-label="loading spinner"
            color="#aa76ff"
          />
          <h2>{message}</h2>
        </div>
      )}
      {isComplete && (
        <div className={styles.form}>
          <h4>{message}</h4>
          <a href={osLink} target="_blank" className={styles.link} rel="noreferrer"><h3>Link to NFT</h3></a>
          <button onClick={() => setIsComplete(false)} className={styles.logout}>Mint Another NFT</button>
        </div>
      )}
    </div>
  )
}

export default Form
