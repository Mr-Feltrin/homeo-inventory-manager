import React, { InputHTMLAttributes, useState, useEffect } from "react";

type FormInputProps = {
    className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(({ className, value: propValue, ...props }, ref) => {
    const [value, setValue] = useState(propValue ?? "");

    useEffect(() => {
        setValue(propValue ?? "");
    }, [propValue]);

    const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
        if (props.type === "number") {
            const inputValue = event.currentTarget.value;
            const regex = /^\d{0,8}(\.\d{0,2})?$/;

            if (regex.test(inputValue)) {
                setValue(inputValue);
            } else {
                event.currentTarget.value = value as string;
            }
        } else {
            setValue(event.currentTarget.value);
        }
    };

    return (
        <input
            {...props}
            type={props.type === "number" ? "text" : props.type}
            inputMode={props.type === "number" ? "decimal" : props.inputMode}
            name={props.name}
            id={props.id ?? props.name}
            ref={ref}
            className={`shadow border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-500 dark:placeholder-gray-300 dark:text-white focus:ring-gray-400 focus:border-gray-400 dark:focus:border-gray-300 dark:focus:ring-gray-300 appearance-none focus:outline-none ${className}`}
            value={value}
            onInput={handleInput}
        />
    );
});

FormInput.displayName = "FormInput";

export default FormInput;