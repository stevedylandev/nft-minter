import { useState } from 'react'
import styles from '@/styles/Form.module.css'
import ScaleLoader from "react-spinners/ScaleLoader"
import fireConfetti from "../../utils/confetti"
import { useAccount } from 'wagmi'
import Input from './Input'
import FileInput from './FileInput'
import Button from './Button'
import Link from './Link'

const Form = () => {
  const [selectedFile, setSelectedFile] = useState()
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [externalURL, setExternalURL] = useState("https://pinata.cloud")
  const [osLink, setOsLink] = useState("https://opensea.io")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isComplete, setIsComplete] = useState(false)


  const { address } = useAccount()

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

  const handleSubmission = async () => {
    if (!selectedFile || !name || !description || !externalURL) {
      alert("Please fill out all fields")
      return
    }
    setIsLoading(true)
    const tempKey = await fetch("/api/key", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const tempKeyJson = await tempKey.json()
    const key = tempKeyJson.JWT
    const formData = new FormData()

    formData.append('file', selectedFile, { filepath: selectedFile.name })

    const metadata = JSON.stringify({
      name: `${selectedFile.name}`,
    })
    formData.append('pinataMetadata', metadata)

    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', options)

    try {
      setMessage("Uploading File...")
      const uploadRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
        },
        body: formData
      })
      const uploadResJson = await uploadRes.json()
      const hash = uploadResJson.IpfsHash

      const jsonData = JSON.stringify({
        name: name,
        description: description,
        image: `${process.env.NEXT_PUBLIC_PINATA_DEDICATED_GATEWAY + hash}`,
        external_url: externalURL
      })

      setMessage("Uploading Metadata...")

      const jsonRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: jsonData
      })
      const jsonResData = await jsonRes.json()
      const uri = jsonResData.IpfsHash

      const mintBody = JSON.stringify({
        address: address,
        uri: `https://discordpinnie.mypinata.cloud/ipfs/${uri}`
      })

      setMessage("Minting NFT...")
      const mintRes = await fetch("/api/mint", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: mintBody
      })
      const mintResData = await mintRes.json()
      console.log(mintResData)
      setOsLink(`https://opensea.io/assets/matic/${mintResData.onChain.contractAddress}/${mintResData.onChain.tokenId}`)

      const deleteData = JSON.stringify({
        apiKey: tempKeyJson.pinata_api_key,
      })
      const deleteKey = await fetch("/api/key", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: deleteData
      })
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
    <div className="flex justify-center items-center flex-col m-auto w-full">
      {!isLoading && !isComplete && (
        <div className="flex flex-col items-center gap-6">
          <FileInput onChange={fileChangeHandler} selectedFile={selectedFile} />
          <Input label="Name" placeHolder="Cool NFT" onChange={nameChangeHandler} />
          <Input label="Description" placeHolder="This NFT is just so cool" onChange={descriptionChangeHandler} />
          <Input label="External URL" placeHolder="https://pinata.cloud" onChange={externalURLChangeHandler} />
          <Button buttonClick={handleSubmission} bg="accent" bgHover="accent2" text="Submit" />
        </div>
      )}
      {isLoading && (
        <div className="flex flex-col justify-center items-center gap-6">
          <ScaleLoader color="#6D57FF" height="150px" width="15px" />
          <h2 className="text-2xl font-telegraf font-bold">{message}</h2>
        </div>
      )}
      {isComplete && (
        <div className="flex flex-col justify-center items-center gap-6">
          <h2 className="text-2xl font-telegraf font-bold">{message}</h2>
          <Link href={osLink} bg="accent" bgHover="accent2" />
          <Button buttonClick={() => setIsComplete(false)} bg="gray-500" bgHover="gray-400" text="Mint Another NFT" />
        </div>
      )}
    </div>
  )
}

export default Form
