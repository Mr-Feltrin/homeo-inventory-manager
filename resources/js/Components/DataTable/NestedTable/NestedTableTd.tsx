import { ReactNode, TdHTMLAttributes } from "react";

type NestedTableTdProps = {
    children?: ReactNode;
    hasImage?: boolean;
} & TdHTMLAttributes<HTMLTableCellElement>;

const NestedTableTd = ({ children, hasImage = false, ...props }: NestedTableTdProps) => {
    return (
        <td {...props} className={`${hasImage ? "flex items-center" : ""} ${`whitespace-nowrap border-gray-200 dark:border-gray-700 px-4 py-1.5 font-medium text-gray-900 dark:text-white cursor-default ${props.className ?? ""}`}`}>
            {children}
        </td>
    );
};

export default NestedTableTd;
