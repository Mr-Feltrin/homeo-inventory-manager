import SearchInput from "@/Pages/Rooms/Partials/SearchInput";
import ConfirmButton from "../Forms/buttons/ConfirmButton";

type DataTableHeaderProps = {
    isLoading?: boolean;
    counterTitle?: string;
    counterAmount?: number;
    buttons?: { title: string; disabled?: boolean; onClick: () => void }[];
    searchProps?: {
        searchValue: string | undefined;
        setSearchValue: (_value: string) => void;
        onSearch: () => void;
        placeholder: string;
    };
};

const DataTableHeader = ({ counterTitle, counterAmount, isLoading = false, buttons, searchProps }: DataTableHeaderProps) => {
    return (
        <div className="flex flex-wrap items-center w-full gap-3 lg:gap-4 justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-grow flex-wrap items-center gap-3 lg:gap-4">
                <div className="border flex-shrink-0 rounded-lg border-gray-300 dark:border-gray-500 py-[0.3125rem] px-2 bg-gray-50 dark:bg-gray-700 cursor-default">
                    <h5>
                        <span className="text-gray-500 dark:text-gray-300">{!isLoading ? counterTitle : "Loading, please wait..."}</span>
                        {!isLoading && <span className=" text-gray-700 dark:text-gray-200 font-bold ms-3">{counterAmount}</span>}
                    </h5>
                </div>

                {searchProps && <SearchInput className="h-9 !border " searchQuery={searchProps.searchValue ?? ""} setSearchQuery={searchProps.setSearchValue} onSearch={searchProps.onSearch} placeholder={searchProps.placeholder} />}
            </div>

            <div className="flex items-center gap-3 lg:gap-4">
                {buttons &&
                    buttons.map((button, index) => (
                        <ConfirmButton key={index} type="button" className="flex items-center justify-center text-sm !px-4" onClick={button.onClick} disabled={button.disabled}>
                            {button.title}
                        </ConfirmButton>
                    ))}
            </div>
        </div>
    );
};
export default DataTableHeader;
