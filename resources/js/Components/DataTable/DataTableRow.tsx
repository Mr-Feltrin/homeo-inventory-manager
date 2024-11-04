type DataTableRowProps = { children?: React.ReactNode; className?: string; rowToggled?: boolean } & React.HTMLAttributes<HTMLTableRowElement>;

const DataTableRow = ({ children, className, rowToggled = false, ...props }: DataTableRowProps) => {
    return (
        <tr {...props} className={className ?? (rowToggled ? "bg-gray-100 dark:bg-gray-600" : "border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 group")}>
            {children}
        </tr>
    );
};

export default DataTableRow;
