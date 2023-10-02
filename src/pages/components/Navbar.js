import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Navbar() {
  return (

    <div className="flex justify-evenly md:justify-between items-center px-4 2xl:px-0 w-full gap-4 rounded-md">
      <a href="https://pinata.cloud" target="_blank" rel="noreferrer">
        <img src="/logo.png" alt="logo" className="h-8" />
      </a>
      <ConnectButton />
    </div>
  )
}
