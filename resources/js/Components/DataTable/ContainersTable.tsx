import DataTable from "@/Components/DataTable/DataTable";
import { containerTableHeaders } from "@/Constants/TableHeaders";
import { useEffect } from "react";
import FormModal from "../Modals/FormModal";
import ContainerForm from "@/Components/Forms/Container/ContainerForm";
import DialogModal from "../Modals/DialogModal";
import NestedItemsTable from "./NestedTable/NestedItemsTable";
import NoContainersFoundIcon from "../Icons/NoContainersFoundIcon";
import { Room } from "@/types/Room";
import useContainers from "@/hooks/Containers/useContainers";
import { Container } from "@/types/Container";
import { Item } from "@/types/Item";

type ContainersTableProps = {
    room?: Room;
    containerState?: ReturnType<typeof useContainers>;
    onContainerView?: (_container: Container) => void;
    onNestedItemView?: (_item: Item) => void;
    onContainerChange?: () => void;
    onNestedItemChange?: () => void;
};

const ContainersTable = ({ room, containerState, onContainerView, onNestedItemView, onContainerChange, onNestedItemChange }: ContainersTableProps) => {
    const {
        state: { isContainerDialogOpen, isContainerFormOpen, selectedContainer, containers, currentPage, totalContainers, totalPages, isFetching, searchQuery },
        dispatch,
        fetchContainers,
        handleSubmit: formSubmit,
        handleDeleteSelection,
        handleContainerDelete: handleDelete,
        handleEditSelection
    } = containerState || useContainers(room && room.id);

    // Handles the change of a nested item and calls the onNestedItemChange callback if it's an Add operation
    const handleItemChange = () => {
        fetchContainers(containerState?.state.currentPage);

        onNestedItemChange?.();
    };

    // Handles the form submission and calls the onContainerChange callback if it's an Add operation
    const handleSubmit = (success: boolean) => {
        if (success) {
            onContainerChange?.();
        }
        formSubmit(success);
    };

    // Handles the deletion of a container and calls the onContainerChange callback if the deletion was successful
    const handleContainerDelete = async () => {
        const deleteResult = await handleDelete();
        if (deleteResult) {
            onContainerChange?.();
        }
    };

    // Fetch the containers if there are none
    useEffect(() => {
        if (!containers?.length) {
            fetchContainers();
        }
    }, []);

    return (
        <>
            <FormModal isOpen={isContainerFormOpen} setIsOpen={isOpen => dispatch({ type: "SET_IS_CONTAINER_FORM_OPEN", payload: isOpen })} title={selectedContainer ? "Edit your Container" : "Add a new Container"}>
                <ContainerForm container={selectedContainer} fromRoom={room} onSubmit={handleSubmit} />
            </FormModal>

            <DialogModal
                isOpen={isContainerDialogOpen && selectedContainer != null}
                setIsOpen={isOpen => dispatch({ type: "SET_IS_CONTAINER_DIALOG_OPEN", payload: isOpen })}
                prompt="Are you sure you want to remove this container? All items related to it will be lost!"
                onConfirm={handleContainerDelete}
            />

            <DataTable
                tableProps={{
                    counterTitle: "Total Containers:",
                    counterAmount: totalContainers,
                    buttons: [
                        {
                            title: "New Container",
                            disabled: isFetching,
                            onClick: () => dispatch({ type: "SET_IS_CONTAINER_FORM_OPEN", payload: true })
                        }
                    ]
                }}
                tableDataHeaders={containerTableHeaders}
                tableData={containers || []}
                dataActions={{ onViewClick: container => onContainerView?.(container), onDeleteClick: handleDeleteSelection, onEditClick: handleEditSelection }}
                paginationProps={{
                    currentPage,
                    setCurrentPage: page => dispatch({ type: "SET_CURRENT_PAGE", payload: page }),
                    totalPages,
                    onPageChange: page => fetchContainers(page)
                }}
                isLoading={isFetching}
                rowToggleElement={rowData => <NestedItemsTable container={rowData} onItemView={onNestedItemView} onItemChange={handleItemChange} />}
                searchProps={{ placeholder: "Search for Containers", onSearch: () => fetchContainers(), searchValue: searchQuery, setSearchValue: query => dispatch({ type: "SET_SEARCH_QUERY", payload: query }) }}
                noDataProps={{ icon: <NoContainersFoundIcon />, message: "No Containers Found" }}
            />
        </>
    );
};

export default ContainersTable;
