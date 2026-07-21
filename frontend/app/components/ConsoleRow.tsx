"use client";
import Link from "next/link";
import Image from "next/image";

const FEATURED_CONSOLES =[
    {name:"Nintendo 64", id:113, source:"/consoles/nintendo64.png"},
    {name: "Nintendo 3DS", id: 112, source:"/./consoles/3ds.jpg" },
    {name: "PlayStation 2", id: 147, source:"/./consoles/ps2"},
    {name: "PlayStation 3", id: 148, source:"/./consoles/ps3"},
    {name: "PlayStation 4", id:149, source:"/./consoles/ps4"},
    {name: "PlayStation 5", id: 150, source:"/./consoles/ps5" },
    {name: "PlayStation Portable", id: 151, source:"/./consoles/psp"},
    {name: "PlayStation Vita", id: 154, source:"/./consoles/psvita"},
    {name: "Xbox Classic", id:211, source:"/./consoles/xboxclassic"},
    {name: "Xbox 360", id: 212, source:"/./consoles/xbox360" },
    {name: "Xbox One", id: 213, source:"/./consoles/xboxone"},
    {name: "Xbox Series X/S", id: 214, source:"/./consoles/xboxx"},
    {name: "Wii", id:204, source:"/./consoles/wii"},
    {name: "Super Nintendo", id: 183, source:"/./consoles/snes" },
    {name: "Nintendo Switch", id: 118, source:"/./consoles/ns1"},
    {name: "Nintendo Switch 2", id: 119, source:"/./consoles/ns2"},
]

type Console = {
  id: number;
  name: string;
  logo: string; 
};

export default function ConsoleRow() {
    return(
        <div className="w-full px-4 py-6">
            <h2 className="font-2xl text-gray-300 font-bold md-2">
                Featured Platforms
            </h2>
            <div className="flex flex-row overflow-x-auto gap-4 pb-2 scrollbar 
            scrollbar-thumb-emerald-400">
                {FEATURED_CONSOLES.map((console) => (
                <Link
                key = {console.id}
                href={`/browse?platform=${console.id}`}
                className=""
                >
                 <Image src={console.source} alt={console.name} width={48} height={48} />

                </Link>
                ))}

            </div>
        </div>
    );
}