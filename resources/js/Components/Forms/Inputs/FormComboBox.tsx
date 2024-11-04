import { forwardRef } from "react";

type ComboboxProps = {
    placeholder?: string;
    options?: { name: string; value: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const FormComboBox = forwardRef<HTMLSelectElement, ComboboxProps>(({ className, options, placeholder, ...props }, ref) => {
    return (
        <select
            name={props.name}
            id={props.id ?? props.name}
            ref={ref}
            className={`text-gray-950 dark:text-white sm:text-sm rounded-lg flex items-center content-center w-full p-2.5 shadow dark:bg-gray-700 border-gray-300 dark:border-gray-500 dark:placeholder-gray-400 focus:ring-gray-400 focus:border-gray-400 dark:focus:ring-gray-300 dark:focus:border-gray-300 appearance-none focus:outline-none disabled:opacity-80 ${className ?? ""}`}
            value=""
            {...props}
        >
            <option value="" disabled hidden>
                {placeholder}
            </option>
            {options &&
                options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.name}
                    </option>
                ))}
        </select>
    );
});

FormComboBox.displayName = "FormComboBox";

export default FormComboBox;
