import { useEffect, useRef, useState } from "react";
import { Room } from "@/types/Room";
import CardMenu from "../Cards/CardMenu";

type RoomsCardProps = {
    roomData?: Room | null;
    onViewRoom: (_room: Room) => void;
    onEditRoom: (_room: Room) => void;
    onDeleteRoom: (_room: Room) => void;
};

const RoomsCard = ({ roomData, onViewRoom, onEditRoom, onDeleteRoom }: RoomsCardProps) => {
    const [cardMenuHidden, setCardMenuHidden] = useState<boolean>(true);

    const cardMenu = useRef<HTMLDivElement>(null!);

    const cardBtnRef = useRef<HTMLButtonElement>(null!);

    const [cardImageLoaded, setCardImageLoaded] = useState<boolean>(false);

    const handleDropdownClick = (e: MouseEvent) => {
        if (cardMenu.current.contains(e.target as Node) || cardBtnRef.current.contains(e.target as Node)) {
            return;
        }
        setCardMenuHidden(true);
    };

    // Sends the Room to be viewed to the parent element
    const handleView = () => {
        onViewRoom && roomData && onViewRoom(roomData);
    };

    // Sends the Room to be edited to the parent element and tells to open the modal
    const handleEdit = () => {
        onEditRoom && roomData && onEditRoom(roomData);
    };

    // Executes the delete function passed by parent element
    const handleDelete = () => {
        if (onDeleteRoom && roomData) {
            onDeleteRoom(roomData);
        }
    };

    useEffect(() => {
        if (!cardMenuHidden) {
            document.addEventListener("mousedown", handleDropdownClick);
        } else {
            document.removeEventListener("mousedown", handleDropdownClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleDropdownClick);
        };
    }, [cardMenuHidden]);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setCardImageLoaded(true);
        (e.target as Element).classList.remove("hidden");
    };

    return (
        <>
            <div className="flex flex-col justify-self-start w-64 justify-between relative max-w-64 bg-white border-[2.5px] border-gray-300 rounded-sm shadow-md dark:shadow-gray-700 dark:bg-gray-800 dark:border-gray-700">
                {roomData && (
                    <>
                        <button
                            ref={cardBtnRef}
                            className="absolute text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 dark:hover:bg-opacity-55 rounded-lg top-0 right-0 mt-2 mr-2 bg-transparent p-1 z-20"
                            onClick={() => (cardMenuHidden ? setCardMenuHidden(false) : setCardMenuHidden(true))}
                        >
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3" data-darkreader-inline-fill="">
                                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"></path>
                            </svg>
                        </button>

                        <CardMenu ref={cardMenu} cardMenuHidden={cardMenuHidden} setCardMenuHidden={setCardMenuHidden} handleView={handleView} handleEdit={handleEdit} handleDelete={handleDelete} />
                    </>
                )}

                {roomData?.image && <img src={roomData.image as string} alt="Room Image" className="hidden h-32" onLoad={handleImageLoad} />}
                {(!cardImageLoaded || !roomData?.image) && (
                    <div className={`flex items-center justify-center h-32 bg-gray-300 rounded-t-sm dark:bg-gray-700 ${roomData?.image ? "animate-pulse" : ""}`}>
                        <svg className="w-10 h-10 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20" data-darkreader-inline-fill="">
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"></path>
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"></path>
                        </svg>
                    </div>
                )}

                <div className="px-4 pt-4 pb-3 bg-gray-200 bg-opacity-75 dark:bg-opacity-100 dark:bg-[#232c36] flex flex-col flex-grow">
                    {!roomData ? (
                        <>
                            <div className="h-4 mb-5 bg-gray-200 rounded-full dark:bg-gray-700 max-w-44 animate-pulse"></div>

                            <div className="mb-2 animate-pulse">
                                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-28 mb-2.5"></div>
                                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-28 mb-2.5"></div>
                            </div>
                        </>
                    ) : (
                        <>
                            <p onClick={handleView} className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white break-words line-clamp-2 cursor-pointer" title={roomData.name}>
                                {roomData.name}
                            </p>

                            <p className="mb-4 text-sm font-thin text-gray-700 dark:text-gray-200 truncate cursor-default" title={roomData.description?.capitalizeFirstLetter()}>{roomData.description?.capitalizeFirstLetter()}</p>

                            <div className="mb-2 mt-auto">
                                <p className="text-gray-600 text-xs dark:text-gray-300 mb-1 cursor-default">Total Items stored: {roomData.items_count}</p>
                                <p className="text-gray-600 text-xs dark:text-gray-300 mb-2 cursor-default">Total Containers: {roomData.containers_count}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default RoomsCard;
