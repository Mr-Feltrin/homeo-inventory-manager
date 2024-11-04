import React, { InputHTMLAttributes } from "react";

type AuthFormInputProps = {
    type: InputHTMLAttributes<HTMLInputElement>["type"];
    name: InputHTMLAttributes<HTMLInputElement>["name"];
    className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const AuthFormInput = ({ type, name, className, ...props }: AuthFormInputProps) => {
    return (
        <input
            className={`w-full focus:ring-gray-400 focus:border-gray-400 px-3 py-2 leading-tight h-[2.8rem] text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${className}`}
            name={name}
            id={name}
            type={type}
            {...props}
        />
    );
};

export default AuthFormInput;
