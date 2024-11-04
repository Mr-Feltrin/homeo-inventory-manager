import { ButtonHTMLAttributes, ReactNode } from "react";

type ConfirmButtonProps = {
    className?: string;
    children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const ConfirmButton = ({ className, children, ...props }: ConfirmButtonProps) => {
    return (
        <button
            {...props}
            className={`py-2 px-8 text-black rounded-lg dark:text-white bg-green-400 dark:bg-green-700 hover:bg-green-300 dark:hover:bg-green-600 disabled:bg-green-300 dark:disabled:bg-green-800 disabled:opacity-80 ${className || ""}`}
        >
            {children}
        </button>
    );
};

export default ConfirmButton;
