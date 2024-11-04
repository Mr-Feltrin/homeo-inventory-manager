import { SelectHTMLAttributes } from "react";
import { Countries } from "@/Constants/Countries";

type SelectCountryProps = {
    name: SelectHTMLAttributes<HTMLSelectElement>["name"];
    className?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

const SelectCountry = ({ name, className, ...props }: SelectCountryProps) => {
    return (
        <select
            name={name}
            id={name}
            className={`border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:ring-gray-400 focus:border-gray-400 dark:focus:ring-gray-300 dark:focus:border-gray-300 appearance-none focus:outline-none ${className}`}
            {...props}
        >
            <option value="">Select a country</option>
            {Countries.map((country: string, index: number) => (
                <option key={index} value={country}>
                    {country}
                </option>
            ))}
        </select>
    );
};

export default SelectCountry;
