import React, { useState, HTMLAttributes } from "react";

type SearchInputProps = {
    className?: string;
    searchQuery: string;
    setSearchQuery: (_query: string) => void;
    placeholder: string;
    onSearch: () => void;
} & HTMLAttributes<HTMLDivElement>;

const SearchInput = ({ className, searchQuery, setSearchQuery, placeholder, onSearch, ...props }: SearchInputProps) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch();
        }
    };

    return (
        <div {...props} className={`max-w-lg relative border-2 ${isFocused ? "border-gray-400 dark:border-gray-300" : "border-gray-300 dark:border-gray-500"} rounded-lg flex overflow-hidden ${className ?? ""}`}>
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
            </div>
            <input
                type="search"
                id="default-search"
                className="block w-full group sm:text-sm ps-10 border-0 focus:ring-0 text-gray-900 bg-gray-50 focus:outline-none dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white peer"
                placeholder={placeholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyPress}
            />
            <button
                type="button"
                className="flex items-center justify-center text-gray-950 dark:text-gray-50 bg-green-400 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600 focus:outline-none font-bold sm:text-sm px-4 py-2"
                onClick={onSearch}
            >
                Search
            </button>
        </div>
    );
};

export default SearchInput;
