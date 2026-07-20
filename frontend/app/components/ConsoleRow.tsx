"use client";
import Link from "next/link";
import Image from "next/image";

const FEATURED_CONSOLES =[]

type Console = {
  id: number;
  name: string;
  logo: string; 
};

export default function ConsoleRow() {
    return(
        <div className="w-full px-4 py-6">
            <h2 className="font-xl text-gray-300 font-bold md-2">
                Featured Platforms
            </h2>
            <div className="flex flex-row overflow-x-auto gap-4 pb-2 scrollbar 
            scrollbar-thumb-emerald-400">

            </div>
        </div>
    );
}