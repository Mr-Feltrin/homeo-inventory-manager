import React, { LabelHTMLAttributes, ReactNode } from "react";

type AuthFormLabelProps = {
    htmlFor: LabelHTMLAttributes<HTMLLabelElement>["htmlFor"];
    className?: string;
    children: ReactNode;
} & LabelHTMLAttributes<HTMLLabelElement>;

const AuthFormLabel = ({ htmlFor, className, children, ...props }: AuthFormLabelProps) => {
    return (
        <label className={`block mb-2 text-sm font-bold text-gray-700 ${className}`} htmlFor={htmlFor} {...props}>
            {children}
        </label>
    );
};

export default AuthFormLabel;
