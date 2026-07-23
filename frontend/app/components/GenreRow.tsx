"use client";
import Link from "next/link";

export interface GenreProps {
  id: number;
  name: string;
}


export default function ConsoleRow({id ,name} : GenreProps) {
    
    return(
        <div className="w-full px-4 py-6">
            <h2 className="text-2xl text-gray-300 font-bold md-2">
                {name} Games:
            </h2>
            <hr></hr>
            <br></br>
            <div className="flex flex-row overflow-x-auto gap-4 pb-2 scrollbar 
            scrollbar-thumb-emerald-400">

            </div>
        </div>
    );
}