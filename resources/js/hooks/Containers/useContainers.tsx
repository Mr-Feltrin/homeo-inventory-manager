import { useReducer, useEffect, Dispatch } from "react";
import { Container } from "@/types/Container";
import useApi from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { AxiosResponse } from "axios";

type State = {
    currentPage: number;
    totalPages: number;
    containers: Container[] | undefined;
    totalContainers: number;
    isFetching?: boolean;
    isContainerFormOpen: boolean;
    selectedContainer: Container | null;
    isContainerDialogOpen: boolean;
    searchQuery?: string;
};

type Action =
    | { type: "SET_CONTAINERS"; payload: Container[] | undefined }
    | { type: "SET_TOTAL_PAGES"; payload: number }
    | { type: "SET_CURRENT_PAGE"; payload: number }
    | { type: "SET_TOTAL_CONTAINERS"; payload: number }
    | { type: "SET_IS_FETCHING"; payload: boolean }
    | { type: "SET_IS_CONTAINER_FORM_OPEN"; payload: boolean }
    | { type: "SET_SELECTED_CONTAINER"; payload: Container | null }
    | { type: "SET_IS_CONTAINER_DIALOG_OPEN"; payload: boolean }
    | { type: "SET_SEARCH_QUERY"; payload: string | undefined };

const initialState: State = {
    currentPage: 1,
    totalPages: 1,
    containers: undefined,
    totalContainers: 0,
    isFetching: undefined,
    isContainerFormOpen: false,
    selectedContainer: null,
    isContainerDialogOpen: false,
    searchQuery: undefined
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_CONTAINERS":
            return { ...state, containers: action.payload };
        case "SET_TOTAL_PAGES":
            return { ...state, totalPages: action.payload };
        case "SET_CURRENT_PAGE":
            return { ...state, currentPage: action.payload };
        case "SET_TOTAL_CONTAINERS":
            return { ...state, totalContainers: action.payload };
        case "SET_IS_FETCHING":
            return { ...state, isFetching: action.payload };
        case "SET_IS_CONTAINER_FORM_OPEN":
            return { ...state, isContainerFormOpen: action.payload };
        case "SET_SELECTED_CONTAINER":
            return { ...state, selectedContainer: action.payload };
        case "SET_IS_CONTAINER_DIALOG_OPEN":
            return { ...state, isContainerDialogOpen: action.payload };
        case "SET_SEARCH_QUERY":
            return { ...state, searchQuery: action.payload };
        default:
            return state;
    }
};

// Custom hook to manage the state of the containers
const useContainers = (roomId?: number) => {
    const [state, dispatch]: [State, Dispatch<Action>] = useReducer(reducer, initialState);
    const { submit } = useApi();
    const toast = useToast();

    // Fetches all containers in a room or all containers if no room is specified
    const fetchAllContainers = async (page: number) => {
        const routeName = roomId ? "rooms.containers" : "containers.all";
        const queryParams = roomId ? { room: roomId, page } : { page };
        submit(route(routeName, queryParams), "GET")
            .then(response => {
                if (response.ok) {
                    dispatch({ type: "SET_CONTAINERS", payload: response.data.data });
                    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
                    dispatch({ type: "SET_TOTAL_PAGES", payload: response.data.last_page });
                    dispatch({ type: "SET_TOTAL_CONTAINERS", payload: response.data.total });
                } else {
                    handleFetchError(response);
                }
            })
            .finally(() => dispatch({ type: "SET_IS_FETCHING", payload: false }));
    };

    // Searches for containers based on the search query
    const searchContainers = async (page: number) => {
        const routeName = roomId ? "rooms.containers.search" : "containers.search";
        const queryParams = roomId ? { room: roomId, page, search: state.searchQuery } : { page, search: state.searchQuery };

        await submit(route(routeName, queryParams), "GET")
            .then(response => {
                if (response.ok) {
                    dispatch({ type: "SET_CONTAINERS", payload: response.data.data });
                    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
                    dispatch({ type: "SET_TOTAL_PAGES", payload: response.data.last_page });
                    dispatch({ type: "SET_TOTAL_CONTAINERS", payload: response.data.total });
                } else {
                    handleFetchError(response);
                }
            })
            .finally(() => dispatch({ type: "SET_IS_FETCHING", payload: false }));
    };

    // Fetches all containers or searches for containers based on the search query
    const fetchContainers = (page: number = 1, isSearch?: boolean) => {
        dispatch({ type: "SET_IS_FETCHING", payload: true });

        if (isSearch !== undefined ? isSearch : !!state.searchQuery) {
            searchContainers(page);
        } else {
            fetchAllContainers(page);
        }
    };

    // Handles the error response from the API
    const handleFetchError = (response: unknown) => {
        if ((response as AxiosResponse).status === 404) {
            dispatch({ type: "SET_CONTAINERS", payload: undefined });
            dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
            dispatch({ type: "SET_TOTAL_PAGES", payload: 1 });
            dispatch({ type: "SET_TOTAL_CONTAINERS", payload: 0 });
        } else {
            toast("danger", (response as AxiosResponse).data.message ?? "An error occurred while fetching the containers.");
        }
    };

    // Handles the form submission for adding or updating a container
    const handleSubmit = (success: boolean) => {
        if (success) {
            dispatch({ type: "SET_IS_CONTAINER_FORM_OPEN", payload: false });
            fetchContainers(state.currentPage);
        } else {
            dispatch({ type: "SET_IS_CONTAINER_FORM_OPEN", payload: false });
        }
    };

    // Handles the selection of a container to delete
    const handleDeleteSelection = (container: Container) => {
        dispatch({ type: "SET_SELECTED_CONTAINER", payload: container });
        dispatch({ type: "SET_IS_CONTAINER_DIALOG_OPEN", payload: true });
    };

    // Handles the deletion of a container
    const handleContainerDelete = async (): Promise<boolean> => {
        if (state.selectedContainer) {
            const response = await submit(route("containers.delete", { id: state.selectedContainer.id }), "DELETE");
            if (response.ok) {
                fetchContainers(state.currentPage);
                dispatch({ type: "SET_IS_CONTAINER_DIALOG_OPEN", payload: false });
                toast("success", "Container deleted successfully.");
                return true;
            } else {
                toast("danger", response.data.message ?? "An error occurred while deleting the container.");
            }
        }
        return false;
    };

    // Handles the selection of a container to edit
    const handleEditSelection = (container: Container) => {
        dispatch({ type: "SET_SELECTED_CONTAINER", payload: container });
        dispatch({ type: "SET_IS_CONTAINER_FORM_OPEN", payload: true });
    };

    // Reset the selected container when the form is closed
    useEffect(() => {
        if (!state.isContainerFormOpen) {
            dispatch({ type: "SET_SELECTED_CONTAINER", payload: null });
        }
    }, [state.isContainerFormOpen]);

    // Reset the selected container when the dialog is closed
    useEffect(() => {
        if (!state.isContainerDialogOpen) {
            dispatch({ type: "SET_SELECTED_CONTAINER", payload: null });
        }
    }, [state.isContainerDialogOpen]);

    return { state, dispatch, fetchContainers, handleSubmit, handleDeleteSelection, handleContainerDelete, handleEditSelection };
};

export default useContainers;
