import { ReactNode } from "react";

type NestedTableHeaderProps = {
    children?: ReactNode;
} & React.ThHTMLAttributes<HTMLTableCellElement>;

const NestedTableHeader = ({ children, ...props }: NestedTableHeaderProps) => {
    return (
        <th {...props} scope="col" className={`px-4 py-1.5 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 ${props.className ? props.className : ""}`}>
            {children}
        </th>
    );
};

export default NestedTableHeader;
