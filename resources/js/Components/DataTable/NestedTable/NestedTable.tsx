import RowDataMenu from "@/Components/DataTable/RowDataMenu";
import NestedTableHeader from "./NestedTableHeader";
import NestedTableTd from "./NestedTableTd";
import TableRowImage from "@/Components/DataTable/TableRowImage";
import ImageIcon from "@/Components/Icons/ImageIcon";
import { TableHeader } from "@/types/TableHeader";
import TableRowData from "../TableRowData";
import { formatDate, isDate } from "@/utils/DateUtils";
import Pagination from "@/Components/Pagination/Pagination";
import ChangeAmountIcon from "@/Components/Icons/ChangeAmountIcon";

type NestedTableProps<T extends { [key: string]: unknown }> = {
    tableData?: T[];
    tableDataHeaders: TableHeader;
    dataActions: {
        onViewClick?: (_item: T) => void;
        onDeleteClick: (_item: T) => void;
        onEditClick: (_item: T) => void;
    };
    paginationProps?: {
        currentPage: number;
        setCurrentPage: (_page: number) => void;
        totalPages: number;
        onPageChange: (_page: number) => void;
        totalItems?: number;
    };
    onAmountChange?: (_item: T) => void;
};

const NestedItemsTable = <T extends { [key: string]: unknown }>({ tableData, tableDataHeaders, dataActions, paginationProps, onAmountChange }: NestedTableProps<T>) => {
    return (
        <div className="p-4">
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg">
                <table className="w-full text-[0.85rem] leading-relaxed text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-[0.85rem] text-gray-700 uppercase cursor-default select-none">
                        {tableData && tableData.length > 0 && (
                            <tr>
                                <NestedTableHeader className="rounded-tl-md"></NestedTableHeader>
                                {tableDataHeaders.map((header, index) => (
                                    <NestedTableHeader key={index}>{header.title}</NestedTableHeader>
                                ))}
                                <NestedTableHeader className="rounded-tr-md"></NestedTableHeader>
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {tableData &&
                            tableData.map((item, index) => (
                                <tr className={`hover:bg-gray-100 dark:hover:bg-gray-600 ${index === tableData.length - 1 && !paginationProps ? "" : "border-b border-gray-200 dark:border-gray-600"}`} key={index}>
                                    <NestedTableTd>
                                        {onAmountChange && <ChangeAmountIcon className="h-7 w-7 bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-500 rounded-lg cursor-pointer" onClick={() => onAmountChange(item)} />}
                                    </NestedTableTd>
                                    {tableDataHeaders.map((header, colIndex) => {
                                        const displayData =
                                            item[header.selector] === null || item[header.selector] === undefined
                                                ? header.defaultValue || ""
                                                : isDate(item[header.selector])
                                                  ? formatDate(item[header.selector] as string)
                                                  : !isNaN(Number(item[header.selector]))
                                                    ? Number(item[header.selector]).toString()
                                                    : (item[header.selector] as string);
                                        return (
                                            <NestedTableTd className="truncate max-w-56" title={displayData} key={`${index}-${colIndex}`} hasImage={!!header.imageSelector}>
                                                {header.imageSelector && item[header.imageSelector] ? (
                                                    <div className="flex items-center">
                                                        <TableRowImage src={item[header.imageSelector] as string} />
                                                        {displayData}
                                                    </div>
                                                ) : header.imageSelector ? (
                                                    <div className="flex items-center">
                                                        <ImageIcon className="w-7 h-7 me-2" />
                                                        {displayData}
                                                    </div>
                                                ) : (
                                                    displayData
                                                )}
                                            </NestedTableTd>
                                        );
                                    })}
                                    <TableRowData>
                                        <RowDataMenu
                                            onClick={e => e.stopPropagation()}
                                            onViewClick={() => dataActions.onViewClick?.(item)}
                                            onDeleteClick={() => dataActions.onDeleteClick?.(item)}
                                            onEditClick={() => dataActions.onEditClick?.(item)}
                                        />
                                    </TableRowData>
                                </tr>
                            ))}
                    </tbody>
                </table>
                <div className="flex justify-end mt-2 me-3">{paginationProps && <Pagination {...paginationProps} paginationSize="xsmall" />}</div>
            </div>
        </div>
    );
};

export default NestedItemsTable;
