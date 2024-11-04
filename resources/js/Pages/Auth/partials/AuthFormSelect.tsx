import { SelectHTMLAttributes } from "react";
import { Countries } from "@/Constants/Countries";

type AuthFormSelectProps = {
    name: SelectHTMLAttributes<HTMLSelectElement>["name"];
    className?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

const AuthFormSelect = ({ name, className, ...props }: AuthFormSelectProps) => {
    return (
        <select
            name={name}
            id={name}
            className={`w-full focus:ring-gray-400 focus:border-gray-400 px-3 py-2 leading-tight h-[2.8rem] text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${className}`}
            {...props}
        >
            <option value="">Select a country</option>
            {Countries.map((country, index) => (
                <option key={index} value={country}>
                    {country}
                </option>
            ))}
        </select>
    );
};

export default AuthFormSelect;
