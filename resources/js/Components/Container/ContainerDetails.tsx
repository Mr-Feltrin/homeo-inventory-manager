import { Container } from "@/types/Container";
import { Item } from "@/types/Item";
import ItemsTable from "../DataTable/ItemsTable";
import ImageIcon from "../Icons/ImageIcon";
import { formatDate } from "@/utils/DateUtils";

type ContainerDetailsProps = {
    container: Container;
    onItemView?: (_item: Item) => void;
    onItemsChange?: () => void;
};

const ContainerDetails = ({ container, onItemView, onItemsChange }: ContainerDetailsProps) => {
    return (
        <>
            <div className="flex justify-center flex-wrap lg:px-6 xl:px-12 2xl:px-36 mb-10 cursor-default">
                <div className="w-full lg:w-1/2 px-4">
                    <div className="w-full border border-gray-600 dark:border-gray-400 rounded-xl overflow-hidden relative shadow-lg">
                        {container.image ? (
                            <>
                                <div className="absolute inset-0">
                                    <img className="w-full h-full blur-sm" src={container.image as string} alt="Background" />
                                </div>
                                <div className="relative flex justify-center">
                                    <img className="h-full shadow max-h-80" src={container.image as string} alt="Image" />
                                </div>
                            </>
                        ) : (
                            <div className="h-72 w-full flex items-center justify-center">
                                <ImageIcon />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col justify-center w-full lg:w-1/2 px-4 mt-8 lg:mt-0">
                    <h1 className="mb-5 text-gray-950 dark:text-white font-extrabold text-2xl">{container.name}</h1>
                    <p className="mb-5 text-gray-700 dark:text-gray-300 text-base">
                        Container Details: <span className="font-bold dark:text-white">{container.details ?? "No details provided for the Container."}</span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-5">
                        Total amount of Items: <span className="font-extrabold dark:text-white">{container.total_items ?? "0"}</span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                        Created at: <span className="font-extrabold dark:text-white">{formatDate(container.created_at!)}</span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                        Last update: <span className="font-extrabold dark:text-white">{formatDate(container.updated_at!)}</span>
                    </p>
                </div>
            </div>

            <div className="flex h-full min-h-[38rem] overflow-auto px-2 w-full mx-auto max-w-screen-2xl lg:px-5 mt-3.5">
                <ItemsTable container={container} onViewItem={onItemView} onItemChange={onItemsChange} />
            </div>
        </>
    );
};

export default ContainerDetails;
