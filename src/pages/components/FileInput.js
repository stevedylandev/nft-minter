const FileInput = ({ onChange, selectedFile }) => {
  return (
    <div className="w-[220px] h-14 flex-col justify-center items-center gap-[3px] inline-flex cursor-pointer">
      <label className="cursor-pointer text-xl font-telegraf self-stretch h-14 rounded-lg bg-gray-500 flex-col justify-center items-center flex hover:bg-gray-400 transition ease-in-out duration-150" onChange={onChange} htmlFor="file">
        <input name="" type="file" id="file" hidden />
        <p className="pt-1">{!selectedFile ? "Select File" : `${selectedFile.name}`}</p>
      </label>
    </div>
  )
}
export default FileInput
