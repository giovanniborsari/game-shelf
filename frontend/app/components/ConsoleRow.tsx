"use client";
import Link from "next/link";
import Image from "next/image";

const FEATURED_CONSOLES =[
    {name:"Nintendo 64", id:113, source:"/consoles/nintendo64.png"},
    {name: "Nintendo 3DS", id: 112, source:"/consoles/3ds.jpg" },
    {name: "PlayStation 2", id: 147, source:"/consoles/ps2.jpg"},
    {name: "PlayStation 3", id: 148, source:"/consoles/ps3.jpg"},
    {name: "PlayStation 4", id:149, source:"/consoles/ps4.jpg"},
    {name: "PlayStation 5", id: 150, source:"/consoles/ps5.png" },
    {name: "PlayStation Portable", id: 151, source:"/consoles/psp.jpg"},
    {name: "PlayStation Vita", id: 154, source:"/consoles/psvita.jpg"},
    {name: "Xbox Classic", id:211, source:"/consoles/xboxclassic.jpg"},
    {name: "Xbox 360", id: 212, source:"/consoles/xbox360.png" },
    {name: "Xbox One", id: 213, source:"/consoles/xboxone.jpg"},
    {name: "Xbox Series X/S", id: 214, source:"/consoles/seriesx.jpg"},
    {name: "Wii", id:204, source:"/consoles/wii.jpg"},
    {name: "Super Nintendo", id: 183, source:"/consoles/snes.png" },
    {name: "Nintendo Switch", id: 118, source:"/consoles/switch.jpg"},
    {name: "Nintendo Switch 2", id: 119, source:"/consoles/ns2.jpg"},
]

type Console = {
  id: number;
  name: string;
  logo: string; 
};

export default function ConsoleRow() {
    return(
        <div className="w-full px-4 py-6">
            <h2 className="text-2xl text-gray-300 font-bold md-2">
                Featured Platforms
            </h2>
            <hr></hr>
            <br></br>
            <div className="flex flex-row overflow-x-auto gap-4 pb-2 scrollbar 
            scrollbar-thumb-emerald-400">
                {FEATURED_CONSOLES.map((console) => (
                <Link
                key = {console.id}
                href={`/browse?platform=${encodeURIComponent(console.id)}`}
                className="shrink-0 flex flex-col items-center gap-2 border-3 
              border-gray-600 rounded-b hover:border-emerald-400 
                transition-colors bg-white"
                >
                 <Image 
                 src={console.source} 
                 alt={console.name} 
                 width={360} 
                 height={240}
                 className=" w-58 l-70 mt-auto mb-auto object-contain " />

                <p className="text-gray-300 text-xl mt-auto text-center 
                font-bold w-full border-emerald-400 bg-gray-900 
                hover:text-emerald-400">
                    {console.name}</p>
                </Link>
                ))}

            </div>
        </div>
    );
}