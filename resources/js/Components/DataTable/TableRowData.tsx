import { ReactNode, TdHTMLAttributes } from "react";

type TableRowDataProps = {
    children?: ReactNode;
    hasImage?: boolean;
} & TdHTMLAttributes<HTMLTableCellElement>;

const TableRowData = ({ children, hasImage = false, ...props }: TableRowDataProps) => {
    return (
        <td {...props} className={`${hasImage ? "flex items-center" : ""} whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white cursor-default select-none ${props.className ?? ""}`}>
            {children}
        </td>
    );
};

export default TableRowData;
