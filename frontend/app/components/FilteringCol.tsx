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

const PLATFORMS = [
    '1292 Advanced Programmable Video System',
    '3DO Interactive Multiplayer',
    '64DD', 
    'AY-3-8500', 
    'AY-3-8603', 
    'AY-3-8605', 
    'AY-3-8606', 
    'AY-3-8607', 
    'AY-3-8610', 
    'AY-3-8760', 
    'Acorn Archimedes', 
    'Acorn Electron', 
    'Advanced Pico Beena', 
    'AirConsole', 
    'Amazon Fire TV', 
    'Amiga', 
    'Amiga CD32', 
    'Amstrad CPC', 
    'Amstrad GX4000', 
    'Amstrad PCW', 
    'Analogue electronics', 
    'Android', 
    'Apple II', 
    'Apple IIGS', 
    'Apple Pippin', 
    'Arcade', 
    'Arcadia 2001', 
    'Arduboy', 
    'Atari 2600', 
    'Atari 5200', 
    'Atari 7800', 
    'Atari 8-bit', 
    'Atari Jaguar', 
    'Atari Jaguar CD', 
    'Atari Lynx', 
    'Atari ST/STE', 
    'BBC Microcomputer System', 
    'Bally Astrocade', 
    'BlackBerry OS', 
    'Blu-ray Player', 
    'CDC Cyber 70', 
    'Call-A-Computer time-shared mainframe computer system', 
    'Casio Loopy', 
    'ColecoVision', 
    'Commodore 16', 
    'Commodore C64/128/MAX', 
    'Commodore CDTV', 
    'Commodore PET', 
    'Commodore Plus/4', 
    'Commodore VIC-20', 
    'DEC GT40', 
    'DOS', 
    'DUPLICATE Stadia', 
    'DVD Player', 
    'Daydream', 
    'Digiblast', 
    'Donner Model 30', 
    'Dragon 32/64', 
    'Dreamcast', 
    'EDSAC', 
    'Elektor TV Games Computer', 
    'Epoch Cassette Vision', 
    'Epoch Super Cassette Vision', 
    'Evercade', 
    'Exidy Sorcerer', 
    'FM Towns', 
    'FM-7', 
    'Fairchild Channel F', 
    'Family Computer', 
    'Family Computer Disk System', 
    'Gamate', 
    'Game & Watch', 
    'Game Boy', 
    'Game Boy Advance', 
    'Game Boy Color', 
    'Game.com', 
    'Gear VR', 
    'Gizmondo', 
    'Google Stadia', 
    'HP 2100', 
    'HP 3000', 
    'Handheld Electronic LCD', 
    'Hyper Neo Geo 64', 
    'HyperScan', 
    'Imlac PDS-1', 
    'Intellivision', 
    'Intellivision Amico', 
    'LaserActive', 
    'LeapTV', 
    'Leapster', 
    'Leapster Explorer/LeadPad Explorer', 
    'Legacy Computer', 
    'Legacy Mobile Device', 
    'Linux', 
    'MSX', 
    'MSX2', 
    'Mac', 
    'Mega Duck/Cougar Boy', 
    'Meta Quest 2', 
    'Meta Quest 3', 
    'Microcomputer', 
    'Microvision', 
    'N-Gage', 
    'NEC PC-6000 Series', 
    'Neo Geo AES', 
    'Neo Geo CD', 
    'Neo Geo MVS', 
    'Neo Geo Pocket', 
    'Neo Geo Pocket Color', 
    'New Nintendo 3DS', 
    'Nintendo 3DS', 
    'Nintendo 64', 
    'Nintendo DS', 
    'Nintendo DSi', 
    'Nintendo Entertainment System', 
    'Nintendo GameCube', 
    'Nintendo Switch', 
    'Nintendo Switch 2', 
    'Nuon', 
    'OOParts', 
    'Oculus Go', 
    'Oculus Quest', 
    'Oculus Rift', 
    'Oculus VR', 
    'Odyssey', 
    'Odyssey 2 / Videopac G7000', 
    'OnLive Game System', 
    'Ouya', 
    'PC (Microsoft Windows)', 
    'PC Engine SuperGrafx', 
    'PC-50X Family', 
    'PC-8800 Series', 
    'PC-9800 Series', 
    'PC-FX', 
    'PDP-1', 
    'PDP-10', 
    'PDP-11', 
    'PDP-7', 
    'PDP-8', 
    'PLATO', 
    'Palm OS', 
    'Panasonic Jungle', 
    'Panasonic M2', 
    'Philips CD-i', 
    'PlayStation 1', 
    'PlayStation 2', 
    'PlayStation 3', 
    'PlayStation 4', 
    'PlayStation 5', 
    'PlayStation Portable', 
    'PlayStation VR', 
    'PlayStation VR2', 
    'PlayStation Vita', 
    'Playdate', 
    'Playdia', 
    'Plug & Play', 
    'PocketStation', 
    'Pokémon mini', 
    'Polymega', 
    'R-Zone', 
    'SDS Sigma 7', 
    'SG-1000', 
    'Satellaview', 
    'Sega 32X', 
    'Sega CD', 
    'Sega CD 32X', 
    'Sega Game Gear', 
    'Sega Master System/Mark III', 
    'Sega Mega Drive/Genesis', 
    'Sega Pico', 
    'Sega Saturn', 
    'Sharp MZ-2200', 
    'Sharp X1', 
    'Sharp X68000', 
    'Sinclair QL', 
    'Sinclair ZX81', 
    'Sol-20', 
    'SteamVR', 
    "Super A'Can", 
    'Super Famicom', 
    'Super NES CD-ROM System', 
    'Super Nintendo Entertainment System', 
    'TRS-80', 
    'TRS-80 Color Computer', 
    'Tapwave Zodiac', 
    'Tatung Einstein', 
    "Terebikko / See 'n Say Video Phone", 
    'Texas Instruments TI-99', 
    'Thomson MO5', 
    'Tomy Tutor / Pyuta / Grandstand Tutor', 
    'TurboGrafx-16/PC Engine', 
    'Turbografx-16/PC Engine CD', 
    'Unknown', 
    'Uzebox', 
    'V.Smile', 
    'VC 4000', 
    'Vectrex', 
    'Virtual Boy', 
    'Virtual Console', 
    'Visual Memory Unit / Visual Memory System', 
    'Watara/QuickShot Supervision', 
    'Web browser', 
    'Wii', 
    'Wii U', 
    'Windows Mixed Reality', 
    'Windows Mobile', 
    'Windows Phone', 
    'WonderSwan', 
    'WonderSwan Color', 
    'Xbox Classic', 
    'Xbox 360', 
    'Xbox One', 
    'Xbox Series X|S', 
    'ZX Spectrum', 
    'Zeebo', 
    'e-Reader / Card-e Reader', 
    'iOS', 
    'visionOS'
];

export default function FilteringCol({ onFilterChange }: FilteringColProps){

    const[search, setSearch] = useState("");
    const[platform, setPlatform] = useState("");
    const[genre, setGenre] = useState("");
    const[min_rating, setMinRating] = useState("");
    const[max_rating, setMaxRating] = useState("");

    //State for selected platforms and for is expanded 
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [isExpandedPlatforms, setIsExpandedPlatforms] = useState(false);

    //State for selected genres
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    const handleApply = (e: React.SubmitEvent) => {
        onFilterChange({
            search,
            platform: selectedPlatforms,
            genre: selectedGenres,
            min_rating,
            max_rating
        })

        e.preventDefault();
    };

    const handleClear = (e: React.SubmitEvent) => {
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
        
        e.preventDefault();
    };

    const handleCheckbox = (platformName: string) => {
        setSelectedPlatforms((prevSelected) => {
            if (prevSelected.includes(platformName)){
                return prevSelected.filter(p => p !== platformName)
            }else{
                return [...prevSelected, platformName];
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
                <label className="text-sm text-gray-200 text-center">Platforms</label>
                <div className="flex flex-col gap-2 p-2 h-40 overflow-y-scroll 
                scrollbar scrollbar-thumb-emerald-400">
                    {PLATFORMS.map((plat) => (  
                    <label key ={plat} className="flex items-center gap-2 
                    test-sm text-white cursor-pointer hover:text-emerald-400
                    transition-colors">
                        <input
                            type = "checkbox"
                            checked = {selectedPlatforms.includes(plat)}
                            onChange= {()=> handleCheckbox(plat)}
                            className="text-sm text-white rounded border-gray-700 
                            bg-transparent accent-emerald-400 cursor-pointer">
                        </input>
                        {plat}
                    </label>
                    ))}    
            </div>
            </div>
            <div className="flex gap-2 mt-2">
            <button type="submit" className="flex-1 bg-emerald-400 hover:bg-emerald-500 text-gray-900 font-bold py-2 px-4 rounded transition-colors">
                Apply
            </button>
            <button type="button" onClick={handleClear} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors">
                Clear
            </button>
            </div>
        </form>
    )
}
    
