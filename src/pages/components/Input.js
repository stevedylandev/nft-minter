const Input = ({ label, onChange, placeHolder }) => {
  return (
    <div className="font-telegraf w-[220px] h-14 flex-col justify-start items-start gap-[3px] inline-flex">
      <div className="self-stretch h-14 rounded-lg border border-gray-300 flex-col justify-start items-start flex focus-within:border-accent transition ease-in-out duration-300">
        <div className="self-stretch h-14 px-3 pt-[9px] pb-2 flex-col justify-start items-start gap-[3px] flex">
          <div className="text-gray-500 text-[11px] font-medium font-telegraf leading-3 tracking-tight group-focus:text-accent">{label}</div>
          <div className="self-stretch justify-start items-center inline-flex">
            <div className="w-[0px] h-6 relative" />
            <input onChange={onChange} placeholder={placeHolder} className="bg-transparent text-white border-none grow shrink basis-0 text-slate-100 text-sm font-medium font-telegraf leading-normal tracking-tight w-full outline-none" />
            <div className="w-6 h-[0px] relative" />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Input
