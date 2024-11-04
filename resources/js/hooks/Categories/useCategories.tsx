import { useReducer, useEffect } from "react";
import { Category } from "@/types/Category";
import useApi from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { AxiosResponse } from "axios";

interface State {
    currentPage: number;
    totalPages: number;
    categories?: Category[];
    selectedCategory: Category | null;
    isFetchLoading: boolean;
    totalCategories: number;
    isFormModalOpen: boolean;
    isDeleteDialogOpen: boolean;
    searchQuery?: string;
}

type Action =
    | { type: "SET_CURRENT_PAGE"; payload: number }
    | { type: "SET_TOTAL_PAGES"; payload: number }
    | { type: "SET_CATEGORIES"; payload: Category[] | undefined }
    | { type: "SET_SELECTED_CATEGORY"; payload: Category | null }
    | { type: "SET_FETCH_LOADING"; payload: boolean }
    | { type: "SET_TOTAL_CATEGORIES"; payload: number }
    | { type: "TOGGLE_FORM_MODAL"; payload: boolean }
    | { type: "TOGGLE_DELETE_DIALOG"; payload: boolean }
    | { type: "SET_SEARCH_QUERY"; payload: string | undefined };

const initialState: State = {
    currentPage: 1,
    totalPages: 1,
    categories: undefined,
    selectedCategory: null,
    isFetchLoading: false,
    totalCategories: 0,
    isFormModalOpen: false,
    isDeleteDialogOpen: false,
    searchQuery: undefined
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_CURRENT_PAGE":
            return { ...state, currentPage: action.payload };
        case "SET_TOTAL_PAGES":
            return { ...state, totalPages: action.payload };
        case "SET_CATEGORIES":
            return { ...state, categories: action.payload };
        case "SET_SELECTED_CATEGORY":
            return { ...state, selectedCategory: action.payload };
        case "SET_FETCH_LOADING":
            return { ...state, isFetchLoading: action.payload };
        case "SET_TOTAL_CATEGORIES":
            return { ...state, totalCategories: action.payload };
        case "TOGGLE_FORM_MODAL":
            return { ...state, isFormModalOpen: action.payload };
        case "TOGGLE_DELETE_DIALOG":
            return { ...state, isDeleteDialogOpen: action.payload };
        case "SET_SEARCH_QUERY":
            return { ...state, searchQuery: action.payload };
        default:
            return state;
    }
}

const useCategories = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const { submit, errors } = useApi();

    const toast = useToast();

    const fetchAllCategories = async (page: number) => {
        submit(route("categories.all", { page }), "GET")
            .then(response => {
                if (response.ok) {
                    dispatch({ type: "SET_CATEGORIES", payload: response.data.data });
                    dispatch({ type: "SET_TOTAL_PAGES", payload: response.data.last_page });
                    dispatch({ type: "SET_TOTAL_CATEGORIES", payload: response.data.total });
                } else {
                    handleFetchError(response);
                }
            })
            .finally(() => dispatch({ type: "SET_FETCH_LOADING", payload: false }));
    };

    const searchCategories = async (page: number) => {
        await submit(route("categories.search", { page }), "GET", { search: state.searchQuery })
            .then(response => {
                if (response.ok) {
                    dispatch({ type: "SET_CATEGORIES", payload: response.data.data });
                    dispatch({ type: "SET_TOTAL_PAGES", payload: response.data.last_page });
                    dispatch({ type: "SET_TOTAL_CATEGORIES", payload: response.data.total });
                } else {
                    handleFetchError(response);
                }
            })
            .finally(() => dispatch({ type: "SET_FETCH_LOADING", payload: false }));
    };

    const fetchCategories = (page: number = 1, isSearch?: boolean) => {
        dispatch({ type: "SET_FETCH_LOADING", payload: true });

        if (isSearch !== undefined ? isSearch : !!state.searchQuery) {
            searchCategories(page);
        } else {
            fetchAllCategories(page);
        }
    };

    const handleFetchError = (response: unknown) => {
        if ((response as AxiosResponse).status === 404) {
            dispatch({ type: "SET_CATEGORIES", payload: undefined });
            dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
            dispatch({ type: "SET_TOTAL_PAGES", payload: 1 });
            dispatch({ type: "SET_TOTAL_CATEGORIES", payload: 0 });
        } else {
            toast("danger", (response as AxiosResponse).data.message ?? "An error occurred while fetching the containers.");
        }
    };

    const handleEdit = (category: Category) => {
        // Set the selected category and open the form modal
        dispatch({ type: "SET_SELECTED_CATEGORY", payload: category });
        dispatch({ type: "TOGGLE_FORM_MODAL", payload: true });
    };

    const handleFormSubmit = (success: boolean) => {
        // Close the form modal and fetch categories if the form submission was successful
        if (success) {
            dispatch({ type: "TOGGLE_FORM_MODAL", payload: false });
            fetchCategories(state.currentPage);
        }
    };

    const handleDelete = (category: Category) => {
        // Set the selected category and open the delete dialog
        dispatch({ type: "SET_SELECTED_CATEGORY", payload: category });
        dispatch({ type: "TOGGLE_DELETE_DIALOG", payload: true });
    };

    const handleDeleteConfirm = () => {
        if (state.selectedCategory) {
            submit(route("categories.delete"), "DELETE", { id: state.selectedCategory.id })
                .then(response => {
                    if (response.ok) {
                        toast("success", "Category has been successfully deleted.");
                        fetchCategories(state.currentPage);
                    } else {
                        toast("danger", errors?.message ?? "An error occurred while deleting the category, please try again later");
                    }
                })
                .finally(() => dispatch({ type: "TOGGLE_DELETE_DIALOG", payload: false }));
        }
    };

    useEffect(() => {
        if (!state.isFormModalOpen) {
            dispatch({ type: "SET_SELECTED_CATEGORY", payload: null });
        }
    }, [state.isFormModalOpen]);

    useEffect(() => {
        if (!state.isDeleteDialogOpen) {
            dispatch({ type: "SET_SELECTED_CATEGORY", payload: null });
        }
    }, [state.isDeleteDialogOpen]);

    return { state, dispatch, fetchCategories, handleEdit, handleFormSubmit, handleDelete, handleDeleteConfirm };
};

export default useCategories;
