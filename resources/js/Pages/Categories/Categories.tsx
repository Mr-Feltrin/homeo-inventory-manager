import ContentArea from "@/Components/Content/ContentArea";
import ContentTitle from "@/Components/Content/ContentTitle";
import DataTable from "@/Components/DataTable/DataTable";
import { Head } from "@inertiajs/react";
import FormModal from "@/Components/Modals/FormModal";
import CategoryForm from "./partials/CategoryForm";
import DialogModal from "@/Components/Modals/DialogModal";
import useCategories from "@/hooks/Categories/useCategories";
import { useEffect } from "react";
import NoCategoriesFoundIcon from "@/Components/Icons/NoCategoriesFoundIcon";
import { categoryTableHeaders } from "@/Constants/TableHeaders";

const Categories = () => {
    const {
        state: { currentPage, totalPages, categories, selectedCategory, isFetchLoading, totalCategories, isFormModalOpen, isDeleteDialogOpen, searchQuery },
        dispatch,
        fetchCategories,
        handleFormSubmit,
        handleDelete,
        handleEdit,
        handleDeleteConfirm
    } = useCategories();

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <>
            <Head title="Categories" />

            <FormModal isOpen={isFormModalOpen} setIsOpen={isOpen => dispatch({ type: "TOGGLE_FORM_MODAL", payload: isOpen })} title={selectedCategory ? "Update Category" : "Add new Category"}>
                <CategoryForm data={selectedCategory} onSubmit={response => handleFormSubmit(response)} />
            </FormModal>

            <DialogModal
                prompt="Are you sure you want to delete this category? If you do so, all the items related to this category will be lost!"
                isOpen={isDeleteDialogOpen}
                setIsOpen={isOpen => dispatch({ type: "TOGGLE_DELETE_DIALOG", payload: isOpen })}
                onConfirm={handleDeleteConfirm}
            ></DialogModal>

            <ContentArea className="min-h-screen">
                <ContentTitle title="Categories List" />

                <div className="flex flex-col flex-1 px-2 w-full mb-8 mx-auto max-w-screen-2xl lg:px-5">
                    <DataTable
                        isLoading={isFetchLoading}
                        tableProps={{
                            counterTitle: "Total Categories:",
                            counterAmount: totalCategories,
                            buttons: [
                                {
                                    title: "New Category",
                                    disabled: isFetchLoading,
                                    onClick: () => {
                                        dispatch({ type: "TOGGLE_FORM_MODAL", payload: true });
                                    }
                                }
                            ]
                        }}
                        paginationProps={{ currentPage, setCurrentPage: page => dispatch({ type: "SET_CURRENT_PAGE", payload: page }), totalPages, onPageChange: page => fetchCategories(page) }}
                        tableDataHeaders={categoryTableHeaders}
                        tableData={categories}
                        dataActions={{ onDeleteClick: handleDelete, onEditClick: handleEdit }}
                        searchProps={{ placeholder: "Search for Categories", searchValue: searchQuery, setSearchValue: value => dispatch({ type: "SET_SEARCH_QUERY", payload: value }), onSearch: () => fetchCategories() }}
                        noDataProps={{ message: "No Categories Found", icon: <NoCategoriesFoundIcon /> }}
                    />
                </div>
            </ContentArea>
        </>
    );
};
export default Categories;
