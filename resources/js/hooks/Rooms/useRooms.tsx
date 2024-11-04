import { useReducer, useEffect } from "react";
import useApi from "@/hooks/useApi";
import { Room } from "@/types/Room";
import { useToast } from "@/hooks/useToast";
import { AxiosResponse } from "axios";

export type State = {
    isFormModalOpen: boolean;
    rooms: Room[] | undefined;
    totalPages: number;
    currentPage: number;
    totalRooms: number;
    searchQuery: string | undefined;
    selectedRoom: Room | undefined;
    deleteDialog: boolean;
    isFetchLoading: boolean;
};

const initialState: State = {
    isFormModalOpen: false,
    rooms: undefined,
    totalPages: 1,
    currentPage: 1,
    totalRooms: 0,
    searchQuery: undefined,
    selectedRoom: undefined,
    deleteDialog: false,
    isFetchLoading: false
};

type Action =
    | { type: "SET_IS_FORM_MODAL_OPEN"; payload: boolean }
    | { type: "SET_ROOMS"; payload: Room[] | undefined }
    | { type: "SET_TOTAL_ROOMS"; payload: number }
    | { type: "SET_TOTAL_PAGES"; payload: number }
    | { type: "SET_CURRENT_PAGE"; payload: number }
    | { type: "SET_SEARCH_QUERY"; payload: string | undefined }
    | { type: "SET_SELECTED_ROOM"; payload: Room | undefined }
    | { type: "SET_DELETE_DIALOG"; payload: boolean }
    | { type: "IS_FETCH_LOADING"; payload: boolean };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_IS_FORM_MODAL_OPEN":
            return { ...state, isFormModalOpen: action.payload };
        case "SET_ROOMS":
            return { ...state, rooms: action.payload };
        case "SET_TOTAL_PAGES":
            return { ...state, totalPages: action.payload };
        case "SET_CURRENT_PAGE":
            return { ...state, currentPage: action.payload };
        case "SET_TOTAL_ROOMS":
            return { ...state, totalRooms: action.payload };
        case "SET_SEARCH_QUERY":
            return { ...state, searchQuery: action.payload };
        case "SET_SELECTED_ROOM":
            return { ...state, selectedRoom: action.payload };
        case "SET_DELETE_DIALOG":
            return { ...state, deleteDialog: action.payload };
        case "IS_FETCH_LOADING":
            return { ...state, isFetchLoading: action.payload };
        default:
            return state;
    }
};

const useRooms = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const showToast = useToast();
    const { submit, isLoading } = useApi<{ search: string } | { room: number } | undefined>();

    // Retrieves all rooms with pagination
    const fetchAllRooms = async (page: number) => {
        await submit(route("rooms.all", { page }), "GET")
            .then(response => {
                if (response.ok) {
                    dispatch({ type: "SET_ROOMS", payload: response.data.data });
                    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
                    dispatch({ type: "SET_TOTAL_PAGES", payload: response.data.last_page });
                    dispatch({ type: "SET_TOTAL_ROOMS", payload: response.data.total ?? 0 });
                } else {
                    handleFetchError(response);
                }
            })
            .finally(() => dispatch({ type: "IS_FETCH_LOADING", payload: false }));
    };

    // Retrieve rooms that matches the search query, also with pagination
    const searchRooms = async (page: number) => {
        await submit(route("rooms.search", { page }), "GET", { search: state.searchQuery })
            .then(response => {
                if (response.ok) {
                    dispatch({ type: "SET_ROOMS", payload: response.data.data });
                    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
                    dispatch({ type: "SET_TOTAL_PAGES", payload: response.data.last_page });
                    dispatch({ type: "SET_TOTAL_ROOMS", payload: response.data.total ?? 0 });
                } else {
                    handleFetchError(response);
                }
            })
            .finally(() => dispatch({ type: "IS_FETCH_LOADING", payload: false }));
    };

    // Fetches the rooms based on the search query or general fetch
    const fetchRooms = (page: number = 1, isSearch?: boolean) => {
        dispatch({ type: "IS_FETCH_LOADING", payload: true });

        if (isSearch !== undefined ? isSearch : !!state.searchQuery) {
            searchRooms(page);
        } else {
            fetchAllRooms(page);
        }
    };

    // Handles the error response from the fetch
    const handleFetchError = (response: unknown) => {
        if ((response as AxiosResponse).status === 404) {
            dispatch({ type: "SET_ROOMS", payload: undefined });
            dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
            dispatch({ type: "SET_TOTAL_PAGES", payload: 1 });
            dispatch({ type: "SET_TOTAL_ROOMS", payload: 0 });
        } else {
            showToast("danger", (response as AxiosResponse).data.message ?? "An error occurred while fetching the rooms.");
        }
    };

    // Clears the search by returning the general search values
    const clearSearch = async () => {
        dispatch({ type: "SET_SEARCH_QUERY", payload: undefined });
        fetchRooms(1, false);
    };

    // Handles the submission of the room form
    const handleSubmit = (isSuccessful: boolean) => {
        if (isSuccessful) {
            dispatch({ type: "SET_IS_FORM_MODAL_OPEN", payload: false });
            dispatch({ type: "SET_SEARCH_QUERY", payload: undefined });
            fetchRooms();
        } else {
            dispatch({ type: "SET_IS_FORM_MODAL_OPEN", payload: false });
        }
    };

    const handleEditSelect = (room: Room) => {
        dispatch({ type: "SET_SELECTED_ROOM", payload: room });
        dispatch({ type: "SET_IS_FORM_MODAL_OPEN", payload: true });
    };

    const handleDeleteSelect = (room: Room) => {
        dispatch({ type: "SET_SELECTED_ROOM", payload: room });
        dispatch({ type: "SET_DELETE_DIALOG", payload: true });
    };

    // Performs the deletion of a room
    const handleDelete = async () => {
        if (state.selectedRoom) {
            await submit(route("rooms.delete"), "DELETE", { id: state.selectedRoom?.id })
                .then(response => {
                    if (response.ok) {
                        showToast("success", "The Room was removed successfully");
                        fetchRooms(state.currentPage);
                    } else {
                        showToast("danger", response.data?.errors?.message ?? "An error occured while deleting the room, please try again later");
                    }
                })
                .finally(() => {
                    dispatch({ type: "SET_SELECTED_ROOM", payload: undefined });
                    dispatch({ type: "SET_DELETE_DIALOG", payload: false });
                });
        }
    };

    // Clears the selectedRoom if the delete dialog state changes to closed
    useEffect(() => {
        if (!state.deleteDialog) {
            dispatch({ type: "SET_SELECTED_ROOM", payload: undefined });
        }
    }, [state.deleteDialog]);

    // Clears the selectedRoom if the form modal state changes to closed
    useEffect(() => {
        if (!state.isFormModalOpen) {
            dispatch({ type: "SET_SELECTED_ROOM", payload: undefined });
        }
    }, [state.isFormModalOpen]);

    return {
        state,
        dispatch,
        fetchRooms,
        clearSearch,
        handleSubmit,
        handleEditSelect,
        handleDeleteSelect,
        handleDelete,
        isLoading
    };
};

export default useRooms;
