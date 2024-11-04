import MinusIcon from "@/Components/Icons/MinusIcon";
import PlusIcon from "@/Components/Icons/PlusIcon";
import { forwardRef, InputHTMLAttributes, useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce";

interface AmountInputProps extends InputHTMLAttributes<HTMLInputElement> {
    onPlusClick?: () => void;
    onMinusClick?: () => void;
}

const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(({ className, value: propValue, onPlusClick, onMinusClick, ...props }, ref) => {
    const [value, setValue] = useState(propValue ?? "");

    useEffect(() => {
        setValue(propValue ?? "");
    }, [propValue]);

    const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
        const inputValue = event.currentTarget.value;
        const regex = /^\d{0,8}(\.\d{0,2})?$/;

        if (regex.test(inputValue)) {
            setValue(inputValue);
        } else {
            event.currentTarget.value = value as string;
        }
    };

    const debouncedOnPlusClick = useCallback(debounce(onPlusClick ?? (() => {}), 150), [onPlusClick]);
    const debouncedOnMinusClick = useCallback(debounce(onMinusClick ?? (() => {}), 150), [onMinusClick]);

    return (
        <div className="relative flex items-center">
            <button type="button" className="absolute left-0 ml-1 dark:bg-gray-600 rounded-lg px-2 py-1 dark:hover:bg-gray-500 group" onClick={debouncedOnPlusClick}>
                <PlusIcon className="!h-6 !m-0 dark:text-gray-300 dark:group-hover:text-gray-200" />
            </button>
            <input
                {...props}
                type="text"
                inputMode="decimal"
                name={props.name}
                id={props.id ?? props.name}
                ref={ref}
                className={`shadow border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 pr-11 dark:bg-gray-700 dark:border-gray-500 dark:placeholder-gray-300 dark:text-white focus:ring-gray-400 focus:border-gray-400 dark:focus:border-gray-300 dark:focus:ring-gray-300 appearance-none focus:outline-none ${className}`}
                value={value}
                onInput={handleInput}
            />
            <button type="button" className="absolute right-0 mr-1 dark:bg-gray-600 rounded-lg px-1.5 py-1 dark:hover:bg-gray-500 group" onClick={debouncedOnMinusClick}>
                <MinusIcon className="h-6 dark:text-gray-300 dark:group-hover:text-gray-200" />
            </button>
        </div>
    );
});

AmountInput.displayName = "AmountInput";

export default AmountInput;
