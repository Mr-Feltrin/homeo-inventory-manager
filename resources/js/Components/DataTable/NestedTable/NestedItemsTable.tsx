import { useEffect } from "react";
import LoadingIcon from "@/Components/Icons/LoadingIcon";
import { Container } from "@/types/Container";
import useItems from "@/hooks/Items/useItems";
import DialogModal from "@/Components/Modals/DialogModal";
import ItemsForm from "@/Components/Forms/Item/ItemsForm";
import FormModal from "@/Components/Modals/FormModal";
import NestedTable from "@/Components/DataTable/NestedTable/NestedTable";
import NoItemsFoundIcon from "@/Components/Icons/NoItemsFound";
import { TableHeader } from "@/types/TableHeader";
import { Item } from "@/types/Item";
import ChangeItemAmountForm from "@/Pages/Items/partials/ChangeItemAmountForm";

type NestedItemsTableProps = {
    container: Container;
    onItemView?: (_item: Item) => void;
    onItemChange?: () => void;
};

const NestedItemsTable = ({ container, onItemView, onItemChange }: NestedItemsTableProps) => {
    const tableHeaders: TableHeader = [
        { title: "Name", selector: "name", imageSelector: "image", showSorting: true },
        { title: "Details", selector: "details", showSorting: true, defaultValue: "No details Provided" },
        { title: "Amount", selector: "amount", showSorting: true },
        { title: "Category", selector: "category_name", showSorting: true },
        { title: "Container", selector: "container_name", showSorting: true },
        { title: "Last Update", selector: "updated_at", showSorting: true }
    ];

    const {
        state: { isFetching, items, isFormModalOpen, selectedItem, isConfirmModalOpen, isAmountModalOpen, currentPage, totalPages, totalItems },
        dispatch,
        fetchItems,
        handleFormSubmit: handleSubmit,
        handleDeleteClick,
        handleConfirmDelete: confirmDelete,
        handleEditClick,
        handleAmountChange
    } = useItems({ entityType: "container", id: container.id! });

    // Calls the confirmDelete function and if the user confirms the deletion
    const handleConfirmDelete = async () => {
        const deletion = await confirmDelete();
        if (deletion) {
            onItemChange?.();
        }
    };

    // Calls the handleFormSubmit function and if the form submission is successful
    const handleFormSubmit = (success: boolean) => {
        if (success) {
            onItemChange?.();
        }

        handleSubmit(success);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <>
            <FormModal isOpen={isFormModalOpen} setIsOpen={isOpen => dispatch({ type: "SET_IS_FORM_MODAL_OPEN", payload: isOpen })} title="Edit your Item">
                <ItemsForm item={selectedItem} onSubmit={handleFormSubmit} />
            </FormModal>

            <FormModal isOpen={isAmountModalOpen} setIsOpen={value => dispatch({ type: "SET_IS_AMOUNT_MODAL_OPEN", payload: value })} title="Edit amount of item">
                <ChangeItemAmountForm item={selectedItem!} onSubmit={handleFormSubmit} />
            </FormModal>

            <DialogModal isOpen={isConfirmModalOpen} setIsOpen={isOpen => dispatch({ type: "SET_IS_CONFIRM_MODAL_OPEN", payload: isOpen })} prompt="Are you sure you want to delete this Item?" onConfirm={handleConfirmDelete} />
            {isFetching && (
                <div className="flex flex-col items-center justify-center pt-3 pb-2">
                    <LoadingIcon />
                    <p className="text-sm text-gray-500 dark:text-gray-200 font-bold pointer-events-none animate-pulse">Loading</p>
                </div>
            )}

            {!isFetching && items && items.length > 0 && (
                <NestedTable
                    tableDataHeaders={tableHeaders}
                    tableData={items}
                    paginationProps={{ currentPage: currentPage, setCurrentPage: page => dispatch({ type: "SET_CURRENT_PAGE", payload: page }), onPageChange: page => fetchItems(page), totalPages: totalPages, totalItems: totalItems }}
                    dataActions={{ onViewClick: onItemView, onEditClick: handleEditClick, onDeleteClick: handleDeleteClick }}
                    onAmountChange={item => handleAmountChange(item)}
                />
            )}

            {!isFetching && items?.length === 0 && (
                <div className="flex flex-col items-center justify-center pt-3 pb-2">
                    <NoItemsFoundIcon />
                    <p className="text-sm text-gray-400 dark:text-gray-300 font-bold pointer-events-none">No Items Found in this Container</p>
                </div>
            )}
        </>
    );
};
export default NestedItemsTable;
