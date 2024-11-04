import ContentArea from "@/Components/Content/ContentArea";
import ContentTitle from "@/Components/Content/ContentTitle";
import { Head } from "@inertiajs/react";
import useRooms from "@/hooks/Rooms/useRooms";
import RoomsList from "./Partials/RoomsList";
import { Room } from "@/types/Room";
import RoomDetails from "@/Components/Room/RoomDetails";
import { Container } from "@/types/Container";
import { Item } from "@/types/Item";
import useSteps from "@/hooks/useSteps";
import ContainerDetails from "@/Components/Container/ContainerDetails";
import ItemDetails from "@/Components/Item/ItemDetails";
import { useEffect } from "react";

type RoomStep =
    | { step: "stepAllRooms"; breadcrumb?: string }
    | { step: "stepViewRoom"; room: Room; breadcrumb?: string }
    | { step: "stepViewContainer"; container: Container; breadcrumb?: string }
    | { step: "stepViewRoomItem"; item: Item; breadcrumb?: string };

type RoomsProps = {
    room?: Room;
};

const Rooms = ({ room }: RoomsProps) => {
    const roomsState = useRooms();
    const { step, updateStep, setCurrentStep, generateBreadcrumbs } = useSteps<RoomStep>({ step: "stepAllRooms", breadcrumb: "Rooms List" });
    const breadcrumbs = generateBreadcrumbs();

    // Reloads the rooms when a relational model changes
    const onRelationalModelChange = () => {
        roomsState.fetchRooms(roomsState.state.currentPage);
    };

    // Updates the step information when the room is updated
    useEffect(() => {
        if (step.step === "stepViewRoom") {
            const updatedRoom = roomsState.state.rooms?.find(r => r.id === step.room.id);
            if (updatedRoom) {
                setCurrentStep({ ...step, room: updatedRoom });
            }
        }
    }, [roomsState.state.rooms, step.step]);

    // Updates the step information if a room is passed as a prop
    useEffect(() => {
        if (room) {
            window.history.replaceState({}, "", route("rooms"));
            updateStep({ step: "stepViewRoom", room: room, breadcrumb: room.name });
        }
    }, [room]);

    return (
        <>
            <Head title="Rooms" />

            <ContentArea className="min-h-screen overflow-auto">
                <ContentTitle title={step.breadcrumb ?? ""} breadCrumbs={breadcrumbs} />
                {step.step === "stepAllRooms" ? (
                    <RoomsList onViewRoom={room => updateStep({ step: "stepViewRoom", room: room, breadcrumb: room.name })} roomState={roomsState} />
                ) : step.step === "stepViewRoom" ? (
                    <RoomDetails
                        room={step.room}
                        onContainerView={container => updateStep({ step: "stepViewContainer", container: container, breadcrumb: container.name })}
                        onItemView={item => updateStep({ step: "stepViewRoomItem", item: item, breadcrumb: item.name })}
                        onRelationalModelChange={onRelationalModelChange}
                    />
                ) : step.step === "stepViewContainer" ? (
                    <ContainerDetails container={step.container} onItemView={item => updateStep({ step: "stepViewRoomItem", item: item, breadcrumb: item.name })} onItemsChange={onRelationalModelChange} />
                ) : (
                    step.step === "stepViewRoomItem" && <ItemDetails item={step.item} />
                )}
            </ContentArea>
        </>
    );
};

export default Rooms;
