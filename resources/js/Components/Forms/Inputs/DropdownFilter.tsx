import React, { useState, useEffect, useRef } from "react";
import ToggleIcon from "../../Icons/ToggleIcon";

type DropdownFilterProps = {
    title: string
    options: { label: string; value: string }[];
    value?: string;
    onChange?: (_value: string) => void;
};

const DropdownFilter = ({ title, options, value, onChange }: DropdownFilterProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsDropdownOpen(prev => !prev);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsDropdownOpen(false);
        onChange && onChange(event.target.value);
    };

    useEffect(() => {
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className="relative">
            <button
                className={`flex justify-start items-center text-start text-gray-500 dark:text-gray-300 ${!isDropdownOpen ? "bg-gray-50 dark:bg-gray-700" : "bg-gray-200/55 dark:bg-gray-600"} hover:bg-gray-200/55 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-500 ring-1 ring-gray-300 dark:ring-gray-500 focus:ring-gray-400 focus:border-gray-400 dark:focus:ring-gray-300 dark:focus:border-gray-300 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center`}
                type="button"
                onClick={toggleDropdown}
                onMouseDown={event => event.stopPropagation()}
            >
                {title}
                <ToggleIcon className="!h-5 !w-5 ms-2" toggleDirection={isDropdownOpen ? "up" : "down"} />
            </button>

            {isDropdownOpen && (
                <div ref={dropdownRef} className="z-10 w-48 absolute top-full mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                    <ul className="p-3 space-y-3 text-sm">
                        {options.map(option => (
                            <li key={option.value}>
                                <div className="flex items-center">
                                    <input
                                        id={`radio-${option.value}`}
                                        type="radio"
                                        value={option.value}
                                        name={`radio-${option.value}`}
                                        checked={value === option.value}
                                        onChange={handleRadioChange}
                                        className={`w-4 h-4 text-green-500 dark:text-green-600 ${option.value === value ? "bg-green-600" : "bg-gray-100 dark:bg-gray-600"}`}
                                    />
                                    <label htmlFor={`radio-${option.value}`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        {option.label}
                                    </label>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownFilter;
