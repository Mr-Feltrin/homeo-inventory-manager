type CancelButtonProps = {
    children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const CancelButton = ({ children, ...props }: CancelButtonProps) => {
    return (
        <button
            {...props}
            type="button"
            className={`py-2.5 px-5 text-sm font-medium text-gray-800 focus:outline-none bg-gray-200 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 ${props.className ?? ""}`}
        >
            {children}
        </button>
    );
};

export default CancelButton;
