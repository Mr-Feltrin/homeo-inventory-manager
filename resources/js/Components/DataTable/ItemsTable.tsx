import useItems from "@/hooks/Items/useItems";
import { useEffect } from "react";
import FormModal from "../Modals/FormModal";
import ItemsForm from "@/Components/Forms/Item/ItemsForm";
import DialogModal from "../Modals/DialogModal";
import NoItemsFoundIcon from "../Icons/NoItemsFound";
import DataTable from "./DataTable";
import { itemTableHeaders } from "@/Constants/TableHeaders";
import { Room } from "@/types/Room";
import { Item } from "@/types/Item";
import { Container } from "@/types/Container";
import ChangeItemAmountForm from "@/Pages/Items/partials/ChangeItemAmountForm";

type ItemsTableProps = {
    itemState?: ReturnType<typeof useItems>;
    room?: Room;
    container?: Container;
    onViewItem?: (_item: Item) => void;
    onItemChange?: () => void;
};

const ItemsTable = ({ itemState, room, container, onViewItem, onItemChange }: ItemsTableProps) => {
    const {
        state: { currentPage, totalPages, items, totalItems, isFetching, isFormModalOpen, isAmountModalOpen, selectedItem, isConfirmModalOpen, searchQuery },
        dispatch,
        fetchItems,
        handleFormSubmit: formSubmit,
        handleDeleteClick,
        handleConfirmDelete: confirmDelete,
        handleAmountChange,
        handleEditClick
    } = itemState || useItems(room ? { entityType: "room", id: room.id! } : container && { entityType: "container", id: container.id! });

    useEffect(() => {
        if (!items?.length) {
            fetchItems();
        }
    }, []);

    // Handle the form submission and call the onItemsChange callback if it's an Add operation
    const handleFormSubmit = (success: boolean) => {
        if (success) {
            onItemChange?.();
        }
        formSubmit(success);
    };

    // Handle the confirmation of the deletion of an Item and call the onItemsChange callback if the deletion was successful
    const handleConfirmDelete = async () => {
        const deletion = await confirmDelete();
        if (deletion) {
            onItemChange?.();
        }
    };

    return (
        <>
            <FormModal isOpen={isFormModalOpen} setIsOpen={isOpen => dispatch({ type: "SET_IS_FORM_MODAL_OPEN", payload: isOpen })} title={selectedItem ? "Edit your Item" : "Add a new Item"}>
                <ItemsForm item={selectedItem} onSubmit={handleFormSubmit} fromContainer={container} fromRoom={room} />
            </FormModal>

            <FormModal isOpen={isAmountModalOpen} setIsOpen={value => dispatch({ type: "SET_IS_AMOUNT_MODAL_OPEN", payload: value })} title="Edit amount of item">
                <ChangeItemAmountForm item={selectedItem!} onSubmit={handleFormSubmit} />
            </FormModal>

            <DialogModal
                prompt="Are you sure you want to delete this Item? This action cannot be undone!"
                isOpen={isConfirmModalOpen}
                setIsOpen={value => dispatch({ type: "SET_IS_CONFIRM_MODAL_OPEN", payload: value })}
                onConfirm={handleConfirmDelete}
            />

            <DataTable
                isLoading={isFetching}
                tableDataHeaders={itemTableHeaders}
                tableData={items ?? undefined}
                tableProps={{
                    counterTitle: "Total Items:",
                    counterAmount: totalItems,
                    buttons: [
                        {
                            title: "Add new Item",
                            disabled: false,
                            onClick: () => {
                                dispatch({ type: "SET_IS_FORM_MODAL_OPEN", payload: true });
                            }
                        }
                    ]
                }}
                paginationProps={{
                    currentPage: currentPage,
                    setCurrentPage: page => {
                        dispatch({ type: "SET_CURRENT_PAGE", payload: page });
                    },
                    totalPages: totalPages,
                    onPageChange: page => {
                        fetchItems(page);
                    }
                }}
                dataActions={{
                    onViewClick: item => onViewItem?.(item),
                    onDeleteClick: handleDeleteClick,
                    onEditClick: handleEditClick
                }}
                searchProps={{
                    placeholder: "Search for Items",
                    onSearch: () => fetchItems(),
                    searchValue: searchQuery,
                    setSearchValue: query => {
                        dispatch({ type: "SET_SEARCH_QUERY", payload: query });
                    }
                }}
                noDataProps={{
                    message: "No Items Found",
                    icon: <NoItemsFoundIcon />
                }}
                onAmountChange={item => handleAmountChange(item)}
            />
        </>
    );
};

export default ItemsTable;
