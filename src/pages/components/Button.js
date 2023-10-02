const Button = ({ buttonClick, bg, bgHover, text }) => {
  return (
    <div className="w-[220px] h-14 flex-col justify-center items-center gap-[3px] inline-flex cursor-pointer">
      <button onClick={buttonClick} className={`cursor-pointer text-xl font-telegraf self-stretch h-14 rounded-lg bg-${bg} flex-col justify-center items-center flex hover:bg-${bgHover} transition ease-in-out duration-150`}>
        <p className="pt-1">{text}</p>
      </button>
    </div>
  )
}
export default Button
