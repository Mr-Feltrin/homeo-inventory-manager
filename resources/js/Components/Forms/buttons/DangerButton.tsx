type DangerButtonProps = {
    children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const DangerButton = ({ children, ...props }: DangerButtonProps) => {
    return (
        <button {...props} className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-700 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
            {children}
        </button>
    );
};

export default DangerButton;
