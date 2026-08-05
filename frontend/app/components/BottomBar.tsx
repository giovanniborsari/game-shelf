export default function BottomBar() {

return (
    <footer className="flex flex-row h-24 items-center w-full bg-gray-900 
    mt-auto">
    <div className="flex flex-row mr-auto ml-auto p-2">
      <label className="text-xl text-white">
        Created by: </label>
      <a href="https://github.com/giovanniborsari" 
      className="text-xl font-bold text-gray-300 hover:text-emerald-400
      ml-2">
        Giovanni Macri Borsari</a>
      <img src="/GitHub_Lockup_White_Clearspace.png"
      className="w-25 ml-2"></img>
    </div>
    </footer>
  );
}