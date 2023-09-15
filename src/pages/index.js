import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Form from "./components/Form"
import Image from "next/image"
import pinnie from "../../public/Pinnie.png"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const { isConnected } = useAccount()

  return (
    <>
      <Head>
        <title>Pinata NFT Minter</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <Image src={pinnie} alt="Pinnie Logo" height={75} />
          <h1 className={inter.className}>Pinata NFT Minter</h1>
          {!isConnected && (
            <ConnectButton />
          )}
          {isConnected && (
            <Form />
          )}
        </div>
      </main>
    </>
  )
}
