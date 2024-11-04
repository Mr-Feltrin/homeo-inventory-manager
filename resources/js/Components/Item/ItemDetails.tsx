import { Item } from "@/types/Item";
import ImageIcon from "../Icons/ImageIcon";
import { formatDate } from "@/utils/DateUtils";

type ItemDetailsprops = {
    item: Item;
};

const ItemDetails = ({ item }: ItemDetailsprops) => {
    return (
        <div className="flex flex-col p-5 items-center xl:justify-center w-full h-full cursor-default rounded-lg bg-gray-200/25 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-700">
            <div className="w-full max-w-2xl d:mt-10 xl:mt-0 lg:justify-center mb-10 mx-4 border border-gray-600 dark:border-gray-400 rounded-xl overflow-hidden shadow-lg relative">
                {item.image ? (
                    <>
                        <div className="absolute inset-0">
                            <img className="w-full h-full blur-sm" src={item.image as string} alt="Background" />
                        </div>
                        <div className="relative flex justify-center">
                            <img className="h-full shadow max-h-80" src={item.image as string} alt="Foreground" />
                        </div>
                    </>
                ) : (
                    <div className="w-full h-60 flex items-center justify-center">
                        <ImageIcon />
                    </div>
                )}
            </div>
            <div className="text-center w-full px-4">
                <h1 className="mb-5 text-gray-950 dark:text-white font-extrabold text-2xl break-words">{item.name.capitalizeFirstLetter()}</h1>
                <p className="mb-3 max-w-xl mx-auto text-gray-700 dark:text-gray-300 text-base break-words">
                    Amount: <span className="font-bold dark:text-white">{parseFloat(item.amount.toString()).toString()}</span>
                </p>
                <p className="mb-3 max-w-xl mx-auto text-gray-700 dark:text-gray-300 text-base break-words">
                    Details: <span className="font-bold dark:text-white">{item.details ? item.details.capitalizeFirstLetter() : "No details provided for the Item."}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-1 break-words">
                    Current Room: <span className="font-extrabold dark:text-white">{item.room_name?.capitalizeFirstLetter()}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-1 break-words">
                    Current Container: <span className="font-bold dark:text-white">{item.container_name?.capitalizeFirstLetter()}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm break-words mb-1">
                    Category: <span className="font-bold dark:text-white">{item.category_name?.capitalizeFirstLetter()}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm break-words mb-1">
                    Created at: <span className="font-bold dark:text-white">{formatDate(item.created_at!)}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm break-words">
                    Last update: <span className="font-bold dark:text-white">{formatDate(item.updated_at!)}</span>
                </p>
            </div>
        </div>
    );
};

export default ItemDetails;
