import { Container } from "@/types/Container";
import { Item } from "@/types/Item";
import { Room } from "@/types/Room";
import { useEffect, useState } from "react";
import DropdownFilter from "../Forms/Inputs/DropdownFilter";
import ContainersTable from "../DataTable/ContainersTable";
import ItemsTable from "../DataTable/ItemsTable";
import ImageIcon from "../Icons/ImageIcon";
import { formatDate } from "@/utils/DateUtils";

type RoomDetailsProps = {
    room: Room;
    onContainerView: (_container: Container) => void;
    onItemView: (_item: Item) => void;
    onRelationalModelChange?: () => void;
};

const RoomDetails = ({ room, onContainerView, onItemView, onRelationalModelChange }: RoomDetailsProps) => {
    const [filterValue, setFilterValue] = useState<"Containers" | "Items">("Containers");

    useEffect(() => {
        console.log("Room prop from room details changed");
    }, [room]);

    return (
        <>
            <div className="flex justify-center flex-wrap lg:px-6 xl:px-12 2xl:px-36">
                <div className="w-full lg:w-1/2 px-4">
                    <div className="w-full border border-gray-600 dark:border-gray-400 rounded-xl overflow-hidden shadow-lg relative">
                        {room.image ? (
                            <>
                                <div className="absolute inset-0">
                                    <img className="w-full h-full blur-sm" src={room.image as string} alt="Background" />
                                </div>
                                <div className="relative flex justify-center">
                                    <img className="h-full shadow max-h-80" src={room.image as string} alt="Room Image" />
                                </div>
                            </>
                        ) : (
                            <div className="h-72 w-full flex items-center justify-center">
                                <ImageIcon />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col justify-center w-full lg:w-1/2 px-4 mt-8 lg:mt-0 cursor-default">
                    <h1 className="mb-5 text-gray-950 dark:text-white font-extrabold text-2xl">{room.name}</h1>
                    <p className="mb-5 text-gray-700 dark:text-gray-300 text-base">{room.description ?? "No description provided."}</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
                        Total amount of Containers: <span className="font-extrabold dark:text-white">{room.containers_count}</span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
                        Total amount of Items: <span className="font-bold dark:text-white">{room.items_count}</span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
                        Created at: <span className="font-bold dark:text-white">{formatDate(room.created_at!)}</span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
                        Last update: <span className="font-bold dark:text-white">{formatDate(room.updated_at!)}</span>
                    </p>
                </div>
            </div>
            <div className="mt-12 px-[0.5625rem] lg:px-[1.3125rem]">
                <DropdownFilter
                    title={`Showing by: ${filterValue}`}
                    options={[
                        { label: "Containers", value: "Containers" },
                        { label: "Items", value: "Items" }
                    ]}
                    value={filterValue}
                    onChange={value => setFilterValue(value as "Containers" | "Items")}
                />
            </div>
            <div className="flex h-full min-h-[38rem] overflow-auto px-2 w-full mb-8 mx-auto max-w-screen-2xl lg:px-5 mt-3.5">
                {filterValue === "Containers" ? (
                    <ContainersTable onContainerView={onContainerView} onNestedItemView={onItemView} room={room} onContainerChange={onRelationalModelChange} onNestedItemChange={onRelationalModelChange} />
                ) : (
                    <ItemsTable onViewItem={onItemView} room={room} onItemChange={onRelationalModelChange}  />
                )}
            </div>
        </>
    );
};

export default RoomDetails;
