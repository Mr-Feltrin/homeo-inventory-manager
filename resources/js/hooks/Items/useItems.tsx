import { useReducer, useEffect, Dispatch } from "react";
import { Item } from "@/types/Item";
import useApi from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { AxiosResponse } from "axios";

type State = {
    currentPage: number;
    totalPages: number;
    items: Item[] | null;
    totalItems: number;
    isFetching?: boolean;
    isFormModalOpen: boolean;
    isAmountModalOpen: boolean;
    selectedItem?: Item;
    isConfirmModalOpen: boolean;
    searchQuery: string | undefined;
};

type Action =
    | { type: "SET_ITEMS"; payload: Item[] | null }
    | { type: "SET_CURRENT_PAGE"; payload: number }
    | { type: "SET_TOTAL_PAGES"; payload: number }
    | { type: "SET_TOTAL_ITEMS"; payload: number }
    | { type: "SET_IS_FETCHING"; payload: boolean }
    | { type: "SET_IS_FORM_MODAL_OPEN"; payload: boolean }
    | { type: "SET_IS_AMOUNT_MODAL_OPEN"; payload: boolean }
    | { type: "SET_SELECTED_ITEM"; payload: Item | undefined }
    | { type: "SET_IS_CONFIRM_MODAL_OPEN"; payload: boolean }
    | { type: "SET_SEARCH_QUERY"; payload: string | undefined };

const initialState: State = {
    currentPage: 1,
    totalPages: 1,
    items: null,
    totalItems: 0,
    isFetching: undefined,
    isFormModalOpen: false,
    isAmountModalOpen: false,
    isConfirmModalOpen: false,
    searchQuery: undefined
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_ITEMS":
            return { ...state, items: action.payload };
        case "SET_TOTAL_PAGES":
            return { ...state, totalPages: action.payload };
        case "SET_CURRENT_PAGE":
            return { ...state, currentPage: action.payload };
        case "SET_TOTAL_ITEMS":
            return { ...state, totalItems: action.payload };
        case "SET_IS_FETCHING":
            return { ...state, isFetching: action.payload };
        case "SET_IS_FORM_MODAL_OPEN":
            return { ...state, isFormModalOpen: action.payload };
        case "SET_IS_AMOUNT_MODAL_OPEN":
            return { ...state, isAmountModalOpen: action.payload };
        case "SET_SELECTED_ITEM":
            return { ...state, selectedItem: action.payload };
        case "SET_IS_CONFIRM_MODAL_OPEN":
            return { ...state, isConfirmModalOpen: action.payload };
        case "SET_SEARCH_QUERY":
            return { ...state, searchQuery: action.payload };
        default:
            return state;
    }
};

// The UseItemsParams type is used to determine if the items to be handled are related to a entity (container or Room)
type UseItemsParams = { entityType: "container" | "room"; id: number } | undefined;

// The useItems hook is used to handle the state and actions related to items
const useItems = (params?: UseItemsParams) => {
    const [state, dispatch]: [State, Dispatch<Action>] = useReducer(reducer, initialState);
    const { submit } = useApi();
    const toast = useToast();

    // Retrieves all the items from api, as well as items related to a entity if declared in the hook initialization
    const fetchAllItems = async (page: number = 1) => {
        dispatch({ type: "SET_IS_FETCHING", payload: true });

        // routeName and queryParams determinate the route and the parameters based on whether the items are related to a entity or not
        const routeName = params?.entityType === "container" ? "containers.items" : params?.entityType === "room" ? "rooms.items" : "items.all";
        const queryParams = params?.entityType === "container" ? { container: params.id, page } : params?.entityType === "room" ? { room: params.id } : { page };

        submit(route(routeName, queryParams), "GET")
            .then(response => {
                if (response.ok) {
                    dispatch({ type: "SET_ITEMS", payload: response.data.data });
                    dispatch({ type: "SET_CURRENT_PAGE", payload: response.data.current_page });
                    dispatch({ type: "SET_TOTAL_PAGES", payload: response.data.last_page });
                    dispatch({ type: "SET_TOTAL_ITEMS", payload: response.data.total });
                } else {
                    handleFetchError(response);
                }
            })
            .finally(() => dispatch({ type: "SET_IS_FETCHING", payload: false }));
    };

    // Searches for items based on the search query
    const searchItems = async (page: number) => {
        const routeName = params?.entityType === "room" ? "rooms.items.search" : params?.entityType === "container" ? "containers.items.search" : "items.search";
        const queryParams = params?.entityType === "room" ? { room: params.id, page, search: state.searchQuery } : params?.entityType === "container" ? { container: params.id, page, search: state.searchQuery } : { page, search: state.searchQuery };

        submit(route(routeName, queryParams), "GET")
            .then(response => {
                if (response.ok) {
                    dispatch({ type: "SET_ITEMS", payload: response.data.data });
                    dispatch({ type: "SET_TOTAL_PAGES", payload: response.data.last_page });
                    dispatch({ type: "SET_CURRENT_PAGE", payload: response.data.current_page });
                    dispatch({ type: "SET_TOTAL_ITEMS", payload: response.data.total });
                } else {
                    handleFetchError(response);
                }
            })
            .finally(() => dispatch({ type: "SET_IS_FETCHING", payload: false }));
    };

    // Handles the error when fetching items and sets the state accordingly
    const handleFetchError = (response: unknown) => {
        if ((response as AxiosResponse).status === 404) {
            dispatch({ type: "SET_ITEMS", payload: null });
            dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
            dispatch({ type: "SET_TOTAL_PAGES", payload: 1 });
            dispatch({ type: "SET_TOTAL_ITEMS", payload: 0 });
        } else {
            toast("danger", (response as AxiosResponse).data.message ?? "An error occurred while fetching the items");
        }
    };

    // Fetches items based on the search query or not and sets the isFetching state to true
    const fetchItems = (page: number = 1, isSearch?: boolean) => {
        dispatch({ type: "SET_IS_FETCHING", payload: true });

        if (isSearch !== undefined ? isSearch : !!state.searchQuery) {
            searchItems(page);
        } else {
            fetchAllItems(page);
        }
    };

    // Handles the form submission based on the success and closes the modals
    const handleFormSubmit = (success: boolean) => {
        if (state.isAmountModalOpen) dispatch({ type: "SET_IS_AMOUNT_MODAL_OPEN", payload: false });
        if (state.isFormModalOpen) dispatch({ type: "SET_IS_FORM_MODAL_OPEN", payload: false });
        if (success) fetchItems(state.currentPage);
    };

    // Opens the form modal with the selected item
    const handleEditClick = (item: Item) => {
        dispatch({ type: "SET_SELECTED_ITEM", payload: item });
        dispatch({ type: "SET_IS_FORM_MODAL_OPEN", payload: true });
    };

    // Opens the confirm modal with the selected item
    const handleDeleteClick = (item: Item) => {
        dispatch({ type: "SET_SELECTED_ITEM", payload: item });
        dispatch({ type: "SET_IS_CONFIRM_MODAL_OPEN", payload: true });
    };

    // Opens the amount modal with the selected item
    const handleAmountChange = async (item: Item) => {
        dispatch({ type: "SET_SELECTED_ITEM", payload: item });
        dispatch({ type: "SET_IS_AMOUNT_MODAL_OPEN", payload: true });
    };

    // Performs the deletion of the selected item and closes the confirm modal
    const handleConfirmDelete = async (): Promise<boolean> => {
        if (state.selectedItem) {
            const response = await submit(route("items.delete"), "DELETE", { id: state.selectedItem.id });
            if (response.ok) {
                fetchItems(state.currentPage);
                dispatch({ type: "SET_IS_CONFIRM_MODAL_OPEN", payload: false });
                toast("success", "Item deleted successfully.");
                return true;
            } else {
                toast("danger", response.data.message ?? "An error occurred while deleting the item.");
                return false;
            }
        }
        return false;
    };

    // Resets the selected item when the form modal is closed
    useEffect(() => {
        if (!state.isFormModalOpen) {
            dispatch({ type: "SET_SELECTED_ITEM", payload: undefined });
        }
    }, [state.isFormModalOpen]);

    // Resets the selected item when the confirm modal is closed
    useEffect(() => {
        if (!state.isConfirmModalOpen) {
            dispatch({ type: "SET_SELECTED_ITEM", payload: undefined });
        }
    }, [state.isConfirmModalOpen]);

    // Resets the selected item when the amount modal is closed
    useEffect(() => {
        if (!state.isAmountModalOpen) {
            dispatch({ type: "SET_SELECTED_ITEM", payload: undefined });
        }
    }, [state.isAmountModalOpen]);

    return { state, dispatch, fetchItems, handleFormSubmit, handleDeleteClick, handleAmountChange, handleConfirmDelete, handleEditClick };
};

export default useItems;
