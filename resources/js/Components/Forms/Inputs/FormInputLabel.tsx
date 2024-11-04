import React, { LabelHTMLAttributes, ReactNode } from "react";

type FormInputLabelProps = {
    htmlFor: LabelHTMLAttributes<HTMLLabelElement>["htmlFor"];
    className?: string;
    children: ReactNode;
} & LabelHTMLAttributes<HTMLLabelElement>;

const FormInputLabel = ({ htmlFor, className, children, ...props }: FormInputLabelProps) => {
    return (
        <label htmlFor={htmlFor} className={`block mb-2 text-sm font-medium text-gray-900 dark:text-white ${className}`} {...props}>
            {children}
        </label>
    );
};

export default FormInputLabel;
