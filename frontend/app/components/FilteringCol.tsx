import React, { useState, useMemo } from 'react';

export type FilterState ={
    search: string;
    platform: string[];
    genre: string[];
    max_rating: string;
    min_rating: string;
}

type FilteringColProps = {
    onFilterChange: (filters: FilterState) => void;
};

const PLATFORMS: Array<[string, number]> = [
  ["1292 Advanced Programmable Video System", 2],
  ["3DO Interactive Multiplayer", 3],
  ["64DD", 4],
  ["AY-3-8500", 5],
  ["AY-3-8603", 6],
  ["AY-3-8605", 7],
  ["AY-3-8606", 8],
  ["AY-3-8607", 9],
  ["AY-3-8610", 10],
  ["AY-3-8760", 11],
  ["Acorn Archimedes", 12],
  ["Acorn Electron", 13],
  ["Advanced Pico Beena", 14],
  ["AirConsole", 15],
  ["Amazon Fire TV", 16],
  ["Amiga", 17],
  ["Amiga CD32", 18],
  ["Amstrad CPC", 19],
  ["Amstrad GX4000", 20],
  ["Amstrad PCW", 21],
  ["Analogue electronics", 22],
  ["Android", 23],
  ["Apple II", 24],
  ["Apple IIGS", 25],
  ["Apple Pippin", 26],
  ["Arcade", 27],
  ["Arcadia 2001", 28],
  ["Arduboy", 29],
  ["Atari 2600", 30],
  ["Atari 5200", 31],
  ["Atari 7800", 32],
  ["Atari 8-bit", 33],
  ["Atari Jaguar", 34],
  ["Atari Jaguar CD", 35],
  ["Atari Lynx", 36],
  ["Atari ST/STE", 37],
  ["BBC Microcomputer System", 38],
  ["Bally Astrocade", 39],
  ["BlackBerry OS", 40],
  ["Blu-ray Player", 41],
  ["CDC Cyber 70", 42],
  ["Call-A-Computer time-shared mainframe computer system", 43],
  ["Casio Loopy", 44],
  ["ColecoVision", 45],
  ["Commodore 16", 46],
  ["Commodore C64/128/MAX", 47],
  ["Commodore CDTV", 48],
  ["Commodore PET", 49],
  ["Commodore Plus/4", 50],
  ["Commodore VIC-20", 51],
  ["DEC GT40", 52],
  ["DOS", 53],
  ["DUPLICATE Stadia", 54],
  ["DVD Player", 55],
  ["Daydream", 56],
  ["Digiblast", 57],
  ["Donner Model 30", 58],
  ["Dragon 32/64", 59],
  ["Dreamcast", 60],
  ["EDSAC", 61],
  ["Elektor TV Games Computer", 62],
  ["Epoch Cassette Vision", 63],
  ["Epoch Super Cassette Vision", 64],
  ["Evercade", 65],
  ["Exidy Sorcerer", 66],
  ["FM Towns", 67],
  ["FM-7", 68],
  ["Fairchild Channel F", 69],
  ["Family Computer", 70],
  ["Family Computer Disk System", 71],
  ["Gamate", 72],
  ["Game & Watch", 73],
  ["Game Boy", 74],
  ["Game Boy Advance", 75],
  ["Game Boy Color", 76],
  ["Game.com", 77],
  ["Gear VR", 78],
  ["Gizmondo", 79],
  ["Google Stadia", 80],
  ["HP 2100", 81],
  ["HP 3000", 82],
  ["Handheld Electronic LCD", 83],
  ["Hyper Neo Geo 64", 84],
  ["HyperScan", 85],
  ["Imlac PDS-1", 86],
  ["Intellivision", 87],
  ["Intellivision Amico", 88],
  ["LaserActive", 89],
  ["LeapTV", 90],
  ["Leapster", 91],
  ["Leapster Explorer/LeadPad Explorer", 92],
  ["Legacy Computer", 93],
  ["Legacy Mobile Device", 94],
  ["Linux", 95],
  ["MSX", 96],
  ["MSX2", 97],
  ["Mac", 98],
  ["Mega Duck/Cougar Boy", 99],
  ["Meta Quest 2", 100],
  ["Meta Quest 3", 101],
  ["Microcomputer", 102],
  ["Microvision", 103],
  ["N-Gage", 104],
  ["NEC PC-6000 Series", 105],
  ["Neo Geo AES", 106],
  ["Neo Geo CD", 107],
  ["Neo Geo MVS", 108],
  ["Neo Geo Pocket", 109],
  ["Neo Geo Pocket Color", 110],
  ["New Nintendo 3DS", 111],
  ["Nintendo 3DS", 112],
  ["Nintendo 64", 113],
  ["Nintendo DS", 114],
  ["Nintendo DSi", 115],
  ["Nintendo Entertainment System", 116],
  ["Nintendo GameCube", 117],
  ["Nintendo Switch", 118],
  ["Nintendo Switch 2", 119],
  ["Nuon", 120],
  ["OOParts", 121],
  ["Oculus Go", 122],
  ["Oculus Quest", 123],
  ["Oculus Rift", 124],
  ["Oculus VR", 125],
  ["Odyssey", 126],
  ["Odyssey 2 / Videopac G7000", 127],
  ["OnLive Game System", 128],
  ["Ouya", 129],
  ["PC (Microsoft Windows)", 130],
  ["PC Engine SuperGrafx", 131],
  ["PC-50X Family", 132],
  ["PC-8800 Series", 133],
  ["PC-9800 Series", 134],
  ["PC-FX", 135],
  ["PDP-1", 136],
  ["PDP-10", 137],
  ["PDP-11", 138],
  ["PDP-7", 139],
  ["PDP-8", 140],
  ["PLATO", 141],
  ["Palm OS", 142],
  ["Panasonic Jungle", 143],
  ["Panasonic M2", 144],
  ["Philips CD-i", 145],
  ["PlayStation 1", 146],
  ["PlayStation 2", 147],
  ["PlayStation 3", 148],
  ["PlayStation 4", 149],
  ["PlayStation 5", 150],
  ["PlayStation Portable", 151],
  ["PlayStation VR", 152],
  ["PlayStation VR2", 153],
  ["PlayStation Vita", 154],
  ["Playdate", 155],
  ["Playdia", 156],
  ["Plug & Play", 157],
  ["PocketStation", 158],
  ["Pokémon mini", 159],
  ["Polymega", 160],
  ["R-Zone", 161],
  ["SDS Sigma 7", 162],
  ["SG-1000", 163],
  ["Satellaview", 164],
  ["Sega 32X", 165],
  ["Sega CD", 166],
  ["Sega CD 32X", 167],
  ["Sega Game Gear", 168],
  ["Sega Master System/Mark III", 169],
  ["Sega Mega Drive/Genesis", 170],
  ["Sega Pico", 171],
  ["Sega Saturn", 172],
  ["Sharp MZ-2200", 173],
  ["Sharp X1", 174],
  ["Sharp X68000", 175],
  ["Sinclair QL", 176],
  ["Sinclair ZX81", 177],
  ["Sol-20", 178],
  ["SteamVR", 179],
  ["Super A'Can", 180],
  ["Super Famicom", 181],
  ["Super NES CD-ROM System", 182],
  ["Super Nintendo Entertainment System", 183],
  ["TRS-80", 184],
  ["TRS-80 Color Computer", 185],
  ["Tapwave Zodiac", 186],
  ["Tatung Einstein", 187],
  ["Terebikko / See 'n Say Video Phone", 188],
  ["Texas Instruments TI-99", 189],
  ["Thomson MO5", 190],
  ["Tomy Tutor / Pyuta / Grandstand Tutor", 191],
  ["TurboGrafx-16/PC Engine", 192],
  ["Turbografx-16/PC Engine CD", 193],
  ["Unknown", 194],
  ["Uzebox", 195],
  ["V.Smile", 196],
  ["VC 4000", 197],
  ["Vectrex", 198],
  ["Virtual Boy", 199],
  ["Virtual Console", 200],
  ["Visual Memory Unit / Visual Memory System", 201],
  ["Watara/QuickShot Supervision", 202],
  ["Web browser", 203],
  ["Wii", 204],
  ["Wii U", 205],
  ["Windows Mixed Reality", 206],
  ["Windows Mobile", 207],
  ["Windows Phone", 208],
  ["WonderSwan", 209],
  ["WonderSwan Color", 210],
  ["Xbox Classic", 211],
  ["Xbox 360", 212],
  ["Xbox One", 213],
  ["Xbox Series X|S", 214],
  ["ZX Spectrum", 215],
  ["Zeebo", 216],
  ["e-Reader / Card-e Reader", 217],
  ["iOS", 218],
  ["visionOS", 219]
];

const GENRES: Array<[string, number]> = [
    ["Adventure", 1],
    ["Arcade", 2],
    ["Card & Board Game", 3],
    ["Fighting", 4],
    ["Hack and slash/Beat 'em up", 5],
    ["Indie", 6],
    ["MOBA", 7],
    ["Music", 8],
    ["Pinball", 9],
    ["Platform", 10],
    ["Point-and-click", 11],
    ["Puzzle", 12],
    ["Quiz/Trivia", 13],
    ["Racing", 14],
    ["Real Time Strategy (RTS)", 15],
    ["Role-playing (RPG)", 16],
    ["Shooter", 17],
    ["Simulator", 18],
    ["Sport", 19],
    ["Strategy", 20],
    ["Tactical", 21],
    ["Turn-based strategy (TBS)", 22],
    ["Unknown", 23],
    ["Visual Novel", 24]
];

export default function FilteringCol({ onFilterChange }: FilteringColProps){

    const[search, setSearch] = useState("");
    const[min_rating, setMinRating] = useState("");
    const[max_rating, setMaxRating] = useState("");

    //State for selected platforms and for is expanded 
    const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);

    //State for selected genres
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

    const handleApply = (e: React.SubmitEvent) => {

        e.preventDefault();

        onFilterChange({
            search,
            platform: selectedPlatforms.map(id => String(id)),
            genre: selectedGenres.map(id => String(id)),
            min_rating,
            max_rating
        })

    };

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setSearch('');
        setMinRating('');
        setMaxRating('');
        setSelectedPlatforms([]);
        setSelectedGenres([]);

        onFilterChange({
            search: "",
            platform: [],
            genre: [],
            min_rating: "",
            max_rating: ""
        })
        
    };

    const handleCheckboxPlat = (id: number) => {
        setSelectedPlatforms((prevSelected) => {
            if (prevSelected.includes(id)){
                return prevSelected.filter(p => p !== id)
            }else{
                return [...prevSelected, id];
            }
        });
    }  

    const handleCheckboxGen = (id: number) => {
        setSelectedGenres((prevSelected) => {
            if (prevSelected.includes(id)){
                return prevSelected.filter(p => p !== id)
            }else{
                return [...prevSelected, id];
            }
        });
    }  

    return(

        <form onSubmit={handleApply} className=" flex flex-col w-72
         border-emerald-300 border-2 rounded ml-10 items-center"> 
            <h2 className='text-2xl font-bold mt-0.5 '>Filters</h2>
            <label className="text-sm text-gray-200"> Search Game 
            </label>
            <input type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)} 
            className='rounded text-black bg-gray-100 m-0.5 ' 
            placeholder="Game"></input>
            <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-200 text-center mt-1">Platforms</label>
                <div className="flex flex-col h-40 overflow-y-scroll 
                scrollbar scrollbar-thumb-emerald-400 text-sm" dir="rtl">
                    <div className='p-4' dir="ltr">
                    {PLATFORMS.map(([name, id]) => (  
                    <label key ={id} className="flex items-center gap-2 
                    test-sm text-white cursor-pointer hover:text-emerald-400
                    transition-colors">
                        <input
                            type = "checkbox"
                            checked = {selectedPlatforms.includes(id)}
                            onChange= {()=> handleCheckboxPlat(id)}
                            className="text-sm text-white rounded border-gray-700 
                            bg-transparent accent-emerald-400 cursor-pointer">
                        </input>
                        {name}
                    </label>
                    ))}
                    </div>    
                </div>
                <label className="text-sm text-gray-200 text-center mt-1">Genres</label>
                <div className="flex flex-col h-40 overflow-y-scroll 
                scrollbar scrollbar-thumb-emerald-400 text-sm" dir="rtl">
                    <div className='p-4' dir="ltr">
                    {GENRES.map(([name, id]) => (  
                    <label key ={id} className="flex items-center gap-2 
                    test-sm text-white cursor-pointer hover:text-emerald-400
                    transition-colors">
                        <input
                            type = "checkbox"
                            checked = {selectedGenres.includes(id)}
                            onChange= {()=> handleCheckboxGen(id)}
                            className="text-sm text-white rounded border-gray-700 
                            bg-transparent accent-emerald-400 cursor-pointer">
                        </input>
                        {name}
                    </label>
                    ))}
                    </div>    
                </div>
                <label className="text-sm text-gray-200 text-center mt-1">Rating Range</label>
                <div className= "flex flex-row h-10 items-center justify-center">
                    <input 
                        type = "number"
                        onChange={(e) => setMinRating(e.target.value)} 
                        className='border border-rounded border-emerald-400 
                        ml-2 w-25'
                        placeholder='Min Rating'
                    /> 
                    <input 
                        type = "number"
                        onChange={(e) => setMaxRating(e.target.value)} 
                        className='border border-rounded border-emerald-400 
                        ml-2 w-25'
                        placeholder='Max Rating'
                    /> 
                </div>
            </div> 
            <div className="flex gap-2 mt-2">
            <button type="submit" className="flex-1 bg-emerald-400 
            hover:bg-emerald-500 text-gray-900 font-bold py-2 px-4 rounded 
            transition-colors">
                Apply
            </button>
            <button type="button" onClick={handleClear} 
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 
            px-4 rounded transition-colors">
                Clear
            </button>
            </div>
        </form>
    )
}
    
