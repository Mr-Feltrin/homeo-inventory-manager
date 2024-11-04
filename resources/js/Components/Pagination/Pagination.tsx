interface PaginationProps {
    currentPage: number;
    setCurrentPage: (_page: number) => void;
    totalPages: number;
    onPageChange: (_page: number) => void;
    paginationSize: "xsmall" | "small" | "normal";
    totalItems?: number;
}

const Pagination = ({ currentPage = 1, setCurrentPage, totalPages, onPageChange, paginationSize = "normal", totalItems }: PaginationProps) => {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = startPage + 3;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - 3);
    }

    if (currentPage > 2 && currentPage < totalPages - 1) {
        startPage = currentPage - 2;
        endPage = currentPage + 1;
    }

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        onPageChange(page);
    };

    return (
        <nav>
            {totalItems && <span className="text-sm me-3">{totalItems} in Total</span>}
            <ul className="inline-flex -space-x-px text-base h-10">
                <li>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`flex items-center justify-center ${paginationSize === "xsmall" ? "px-3 h-7" : paginationSize === "normal" ? "px-4 h-10" : "px-3 h-8"}  ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                    >
                        Previous
                    </button>
                </li>
                {pages.map(page => (
                    <li key={page} className={`${page === currentPage ? "" : "hidden md:block"}`}>
                        <button
                            onClick={() => {
                                if (page !== currentPage) {
                                    handlePageChange(page);
                                }
                            }}
                            className={`flex items-center justify-center ${paginationSize === "xsmall" ? "px-3 h-7" : paginationSize === "normal" ? "px-4 h-10" : "px-3 h-8"} leading-tight ${currentPage === page ? "text-gray-900 border border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"}`}
                        >
                            {page}
                        </button>
                    </li>
                ))}
                {totalPages > 4 && currentPage < totalPages - 1 && (
                    <li className="hidden md:block">
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            className={`flex items-center justify-center ${paginationSize === "xsmall" ? "px-3 h-7" : paginationSize === "normal" ? "px-4 h-10" : "px-3 h-8"} leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                        >
                            ...{totalPages}
                        </button>
                    </li>
                )}
                <li>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`flex items-center justify-center ${paginationSize === "xsmall" ? "px-3 h-7" : paginationSize === "normal" ? "px-4 h-10" : "px-3 h-8"} leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
