import { useEffect, useRef } from "react";
import RoomsCard from "../Partials/Cards/RoomsCard";
import { Room } from "@/types/Room";
import HomeoIcon from "@/Components/Icons/HomeoIcon";
import NoRoomsFoundIcon from "@/Components/Icons/NoRoomsFound";
import useRooms from "@/hooks/Rooms/useRooms";
import FormModal from "@/Components/Modals/FormModal";
import RoomForm from "@/Components/Forms/Room/RoomForm";
import DialogModal from "@/Components/Modals/DialogModal";
import SearchInput from "@/Pages/Rooms/Partials/SearchInput";
import AddPlusIcon from "@/Components/Icons/PlusIconBordered";
import Pagination from "@/Components/Pagination/Pagination";

type RoomsListProps = {
    roomState?: ReturnType<typeof useRooms>;
    onViewRoom?: (_room: Room) => void;
};

const RoomsList = ({ roomState, onViewRoom }: RoomsListProps) => {
    const noRoomsContainer = useRef<HTMLDivElement>(null);
    const { state, dispatch, fetchRooms, handleSubmit, clearSearch, handleEditSelect, handleDeleteSelect, handleDelete } = roomState || useRooms();

    useEffect(() => {
        // Fetch rooms when the component mounts
        if (!state.rooms?.length) {
            fetchRooms();
        }
    }, []);

    return (
        <>
            <FormModal isOpen={state.isFormModalOpen} setIsOpen={(isOpen: boolean) => dispatch({ type: "SET_IS_FORM_MODAL_OPEN", payload: isOpen })} title={state.selectedRoom ? "Edit your Room" : "Add a new Room"}>
                <RoomForm onSubmit={result => handleSubmit(result)} data={state.selectedRoom} />
            </FormModal>

            <DialogModal isOpen={state.deleteDialog} setIsOpen={isOpen => dispatch({ type: "SET_DELETE_DIALOG", payload: isOpen })} prompt="Are you sure you want to delete this Room?" onConfirm={handleDelete} />

            <div className="flex flex-wrap items-center px-4 md:px-7 mb-7 lg:mb-12 gap-6">
                <div className="cursor-default">
                    <h1 className="text-base font-semibold text-gray-900 dark:text-white">
                        <span className="border-2 border-gray-300 shadow-sm dark:shadow-gray-700 dark:border-gray-500 rounded-full px-2 py-1 dark:bg-[#232c36]">Total Rooms: {state.totalRooms}</span>
                    </h1>
                </div>

                <div>
                    <SearchInput
                        className="!rounded-full !h-[1.9375rem] !max-w-72"
                        searchQuery={state.searchQuery ?? ""}
                        setSearchQuery={query => dispatch({ type: "SET_SEARCH_QUERY", payload: query })}
                        placeholder="Search for a Room"
                        onSearch={() => {
                            fetchRooms();
                        }}
                    />
                </div>

                <div>
                    <button
                        className="flex items-center px-5 bg-green-400 hover:bg-green-500 shadow-sm dark:shadow-gray-700 rounded-full h-[1.9375rem] border-2 border-gray-300 dark:border-gray-500 dark:hover:border-gray-300 hover:border-gray-400 text-gray-900 font-medium dark:text-white dark:hover:bg-green-600 group dark:bg-green-700"
                        type="button"
                        onClick={() => dispatch({ type: "SET_IS_FORM_MODAL_OPEN", payload: true })}
                    >
                        <AddPlusIcon />
                        New Room
                    </button>
                </div>
            </div>

            <div className={`mx-4 md:mx-7 mb-7 pt-4 flex${state.isFetchLoading || (!state.isFetchLoading && (!state.rooms || state.rooms?.length === 0)) ? " flex-col justify-center items-center flex-1" : ""}`}>
                {state.isFetchLoading ? (
                    <HomeoIcon className="text-white w-48 h-auto brightness-[75%] dark:brightness-[50%] animate-pulse pointer-events-none" />
                ) : (
                    <>
                        {state.rooms && state.rooms.length > 0 ? (
                            <div className={`flex flex-row flex-wrap ${state.rooms.length > 1 ? "justify-center" : "justify-start"} gap-6  w-full`}>
                                {state.rooms.map((room: Room) => (
                                    <RoomsCard key={room.id} roomData={room} onViewRoom={room => onViewRoom?.(room)} onEditRoom={room => handleEditSelect(room)} onDeleteRoom={room => handleDeleteSelect(room)} />
                                ))}
                            </div>
                        ) : (
                            <div className="mb-20 dark:invert opacity-30" ref={noRoomsContainer}>
                                <div className="flex flex-col justify-center items-center">
                                    <NoRoomsFoundIcon className="w-48 lg:w-52 h-auto mb-0.5" />
                                    <h1 className="text-center text-lg mt-[-1rem] text-dark font-extrabold mb-0.5 select-none">No Rooms Found</h1>
                                    {!!state.searchQuery && (
                                        <button className="mt-2 px-2 rounded-full h-[1.9375rem] border-2 border-gray-600 hover:border-black font-bold" onClick={clearSearch}>
                                            Get all results
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="flex items-center justify-center mt-auto mb-6">
                <Pagination
                    currentPage={state.currentPage}
                    setCurrentPage={page => {
                        dispatch({ type: "SET_CURRENT_PAGE", payload: page });
                    }}
                    totalPages={state.totalPages}
                    onPageChange={page => {
                        fetchRooms(page);
                    }}
                    paginationSize="normal"
                />
            </div>
        </>
    );
};

export default RoomsList;
