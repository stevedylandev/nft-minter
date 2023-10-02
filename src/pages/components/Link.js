const Link = ({ bg, bgHover, href }) => {
  return (
    <div className="w-[220px] h-14 flex-col justify-center items-center gap-[3px] inline-flex cursor-pointer">
      <a href={href} target="_blank" rel="noreferrer" className={`pt-1 cursor-pointer font-telegraf text-xl self-stretch h-14 rounded-lg bg-${bg} flex-col justify-center items-center flex hover:bg-${bgHover} transition ease-in-out duration-150`}>
        Link to NFT
      </a>
    </div>
  )
}
export default Link
