import { TableHeader } from "@/types/TableHeader";
import HomeoIcon from "../Icons/HomeoIcon";
import Pagination from "../Pagination/Pagination";
import DataTableHeader from "./DataTableHeader";
import SortingIcon from "../Icons/SortingIcon";
import DataTableRow from "./DataTableRow";
import TableRowData from "./TableRowData";
import RowDataMenu from "./RowDataMenu";
import ImageIcon from "../Icons/ImageIcon";
import TableRowImage from "./TableRowImage";
import { cloneElement, Fragment, ReactElement, useMemo, useState } from "react";
import { formatDate, isDate } from "@/utils/DateUtils";
import ToggleIcon from "../Icons/ToggleIcon";
import ChangeAmountIcon from "../Icons/ChangeAmountIcon";

type DataTableProps<T extends { [key: string]: unknown }> = {
    tableProps: {
        counterTitle: string;
        counterAmount: number;
        buttons?: { title: string; disabled?: boolean; onClick: () => void }[];
    };
    tableDataHeaders: TableHeader;
    tableData?: T[] | null;
    paginationProps: {
        currentPage: number;
        setCurrentPage: (_page: number) => void;
        totalPages: number;
        onPageChange: (_page: number) => void;
    };
    isLoading?: boolean;
    dataActions: {
        onViewClick?: (_item: T) => void;
        onDeleteClick?: (_item: T) => void;
        onEditClick?: (_item: T) => void;
    };
    searchProps?: {
        searchValue: string | undefined;
        setSearchValue: (_value: string) => void;
        onSearch: () => void;
        placeholder: string;
    };
    noDataProps?: {
        icon: ReactElement;
        message: string;
    };
    onAmountChange?: (_item: T) => void;
    rowToggleElement?: (_rowData: T) => ReactElement;
};

const DataTable = <T extends { [key: string]: unknown }>({ tableProps, searchProps, noDataProps, tableDataHeaders, tableData, paginationProps, isLoading = true, dataActions, rowToggleElement, onAmountChange }: DataTableProps<T>) => {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
    const [toggledRowIndex, setToggledRowIndex] = useState<number | null>(null);
    const hasData = tableData && tableData.length > 0;

    // Set the current toggled row, allowing only one row to be toggled at a time
    const handleRowToggle = (index: number) => {
        setToggledRowIndex(prevIndex => (prevIndex === index ? null : index));
    };

    // Function to check if the data meant to sort is already sorted in ascending order
    const isSortedAsc = (data: T[], key: string): boolean => {
        for (let i = 1; i < data.length; i++) {
            const aValue = data[i - 1][key] as string;
            const bValue = data[i][key] as string;
            if (isDate(aValue as string) && isDate(bValue as string)) {
                if (new Date(aValue as string).getTime() > new Date(bValue as string).getTime()) {
                    return false;
                }
            } else if (aValue > bValue) {
                return false;
            }
        }
        return true;
    };

    // Function to set the sorting configuration of a column
    const handleSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key) {
            direction = sortConfig.direction === "asc" ? "desc" : "asc";
        } else if (handledData && isSortedAsc(handledData, key)) {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Function to return data sorted (or not)
    const handledData = useMemo(() => {
        if (!sortConfig) {
            return tableData;
        }
        const sorted = [...(tableData || [])].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === null && bValue !== null) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue !== null && bValue === null) return sortConfig.direction === "asc" ? 1 : -1;
            if (aValue === null && bValue === null) return 0;

            if (isDate(aValue as string) && isDate(bValue as string)) {
                const aDate = new Date(aValue as string).getTime();
                const bDate = new Date(bValue as string).getTime();
                return sortConfig.direction === "asc" ? aDate - bDate : bDate - aDate;
            }

            return sortConfig.direction === "asc" ? (aValue as string).localeCompare(bValue as string) : (bValue as string).localeCompare(aValue as string);
        });
        return sorted;
    }, [tableData, sortConfig]);

    return (
        <div className="relative overflow-hidden shadow-lg dark:shadow-sm border dark:border-gray-700 dark:shadow-gray-700 dark:bg-gray-800 rounded-lg flex flex-col flex-1">
            <DataTableHeader {...tableProps} searchProps={searchProps} isLoading={isLoading} />
            <div className="overflow-x-auto flex-grow relative">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    {!isLoading && tableData && tableData.length > 0 && (
                        <thead className="text-sm uppercase text-gray-700 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 z-10">
                            <tr>
                                {tableDataHeaders && (
                                    <>
                                        <th className="px-4 py-3"></th>
                                        {tableDataHeaders.map((header, index) => (
                                            <th key={index} scope="col" className="px-4 py-3 select-none">
                                                <div className={`inline-flex items-center space-x-1 select-none ${header.showSorting ? "cursor-pointer" : "cursor-default"}`} onClick={() => header.showSorting && handleSort(header.selector)}>
                                                    {header.title}
                                                    {header.showSorting && <SortingIcon direction={sortConfig?.key === header.selector ? sortConfig.direction : undefined} />}
                                                </div>
                                            </th>
                                        ))}
                                        <th className="px-4 py-3"></th>
                                    </>
                                )}
                            </tr>
                        </thead>
                    )}
                    {isLoading ? (
                        <tbody>
                            <tr>
                                <td className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                                    <HomeoIcon className="text-white w-48 h-auto brightness-[75%] dark:brightness-[50%] animate-pulse pointer-events-none" />
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {hasData && handledData ? (
                                handledData.map(data => {
                                    const index = tableData.indexOf(data);
                                    return (
                                        <Fragment key={index}>
                                            <DataTableRow rowToggled={toggledRowIndex === index} onClick={() => (rowToggleElement ? handleRowToggle(index) : null)}>
                                                <TableRowData>
                                                    {rowToggleElement && <ToggleIcon toggleDirection={toggledRowIndex === index ? "up" : "down"} />}
                                                    {onAmountChange && (
                                                        <ChangeAmountIcon className="h-7 w-7 bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-500 rounded-lg cursor-pointer" onClick={() => onAmountChange(data)} />
                                                    )}
                                                </TableRowData>
                                                {tableDataHeaders.map((header, colIndex) => {
                                                    const displayData =
                                                        data[header.selector] === null || data[header.selector] === undefined
                                                            ? header.defaultValue || ""
                                                            : isDate(data[header.selector])
                                                              ? formatDate(data[header.selector] as string)
                                                              : !isNaN(Number(data[header.selector]))
                                                                ? Number(data[header.selector]).toString()
                                                                : (data[header.selector] as string);
                                                    return (
                                                        <TableRowData title={displayData} className={`truncate max-w-56 ${header.highlight ? "font-bold" : ""}`} key={`${index}-${colIndex}`} hasImage={!!header.imageSelector}>
                                                            {header.imageSelector && data[header.imageSelector] ? (
                                                                <div className="flex items-center">
                                                                    <TableRowImage src={data[header.imageSelector] as string} />
                                                                    {isDate(data[header.selector] as string) ? formatDate(data[header.selector] as string) : (data[header.selector] as string)}
                                                                </div>
                                                            ) : header.imageSelector ? (
                                                                <div className="flex items-center">
                                                                    <ImageIcon className="w-7 h-7 me-2" />
                                                                    {displayData}
                                                                </div>
                                                            ) : (
                                                                displayData
                                                            )}
                                                        </TableRowData>
                                                    );
                                                })}
                                                <TableRowData>
                                                    <RowDataMenu
                                                        onClick={e => e.stopPropagation()}
                                                        onViewClick={dataActions.onViewClick ? () => dataActions.onViewClick?.(data) : undefined}
                                                        onDeleteClick={() => dataActions.onDeleteClick?.(data)}
                                                        onEditClick={() => dataActions.onEditClick?.(data)}
                                                    />
                                                </TableRowData>
                                            </DataTableRow>
                                            {toggledRowIndex === index && rowToggleElement && (
                                                <DataTableRow className="border-b dark:border-gray-700">
                                                    <td colSpan={tableDataHeaders.length + 2}>{rowToggleElement(data)}</td>
                                                </DataTableRow>
                                            )}
                                        </Fragment>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center opac justify-center">
                                        {noDataProps?.icon && cloneElement(noDataProps.icon, { className: "h-36 opacity-70 w-auto mb-6" })}
                                        <p className="text-lg font-bold opacity-70">{noDataProps?.message ?? "No data found"}</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    )}
                </table>
            </div>
            {hasData && (
                <div className={`flex items-center justify-center px-5 pb-3 pt-5 ${isLoading ? "hidden" : ""}`}>
                    <Pagination paginationSize="small" currentPage={paginationProps.currentPage} setCurrentPage={paginationProps.setCurrentPage} totalPages={paginationProps.totalPages} onPageChange={paginationProps.onPageChange} />
                </div>
            )}
        </div>
    );
};
export default DataTable;
