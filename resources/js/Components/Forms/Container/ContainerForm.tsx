import ConfirmButton from "@/Components/Forms/buttons/ConfirmButton";
import FormInput from "@/Components/Forms/Inputs/FormInput";
import FormInputLabel from "@/Components/Forms/Inputs/FormInputLabel";
import InputError from "@/Components/Forms/Inputs/InputError";
import { useToast } from "@/hooks/useToast";
import { Container } from "@/types/Container";
import { FormEventHandler, useEffect, useState } from "react";
import useApi from "@/hooks/useApi";
import ImageIcon from "@/Components/Icons/ImageIcon";
import FormComboBox from "@/Components/Forms/Inputs/FormComboBox";
import { Room } from "@/types/Room";
import FormTextarea from "../Inputs/FormTextarea";

type ContainerFormProps = {
    container?: Container | null;
    onSubmit: (_success: boolean) => void;
    fromRoom?: Room;
};

const ContainerForm = ({ container, fromRoom, onSubmit }: ContainerFormProps) => {
    const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
    const [isRoomsLoading, setIsRoomsLoading] = useState<boolean>(true);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const [rooms, setRooms] = useState<Room[] | null>([]);
    const [imageInputValue, setImageInputValue] = useState<string | null>(null);

    const showToast = useToast();

    const {
        data: containerFormData,
        setData: setContainerFormData,
        errors,
        submit
    } = useApi<Container>({
        id: container?.id || undefined,
        name: container?.name || "",
        details: container?.details || "",
        room_id: container?.room_id || fromRoom?.id,
        image: typeof container?.image === "string" ? undefined : null
    });

    // Handle the form submission and call the onSubmit callback if it was successful
    const handleSubmit: FormEventHandler = e => {
        e.preventDefault();
        setIsSubmitLoading(true);
        submit(container ? route("containers.update") : route("containers.store"), container ? "PATCH" : "POST")
            .then(response => {
                if (response.ok) {
                    showToast("success", container ? "Container has been successfully updated" : "Container has been successfully added");
                    onSubmit(true);
                } else {
                    if (response.status === 500) {
                        showToast("danger", "An error occurred while processing your request. Please try again.");
                        onSubmit(false);
                    }
                }
            })
            .finally(() => {
                setIsSubmitLoading(false);
            });
    };

    // Handle the image upload and set the image in the form data
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setUploadedImagePreview(reader.result);
                }
                setContainerFormData("image", file);
            };
            reader.readAsDataURL(file);
            setImageInputValue(e.target.value);
        }
    };

    // Handle the image removal and set the image in the form data to null
    const handleImageRemoval = () => {
        setContainerFormData("image", null);
        setUploadedImagePreview(null);
        setImageInputValue("");
    };

    // Fetch the rooms for the ComboBox
    const handleRoomsFetch = () => {
        if (fromRoom && !container) {
            setRooms([{ id: fromRoom.id, name: fromRoom.name }]);
            setIsRoomsLoading(false);
        } else {
            setIsRoomsLoading(true);
            submit(route("rooms.simple_list"), "GET", {})
                .then(response => {
                    if (response.ok) {
                        setRooms(response.data);
                    } else {
                        showToast("danger", "An error occurred while obtaining the rooms. Please try again later");
                        onSubmit(false);
                    }
                })
                .finally(() => {
                    setIsRoomsLoading(false);
                });
        }
    };

    // Revoke the object URL when the component unmounts
    useEffect(() => {
        return () => {
            if (uploadedImagePreview) {
                URL.revokeObjectURL(uploadedImagePreview);
            }
        };
    }, [uploadedImagePreview]);

    useEffect(() => {
        handleRoomsFetch();
    }, []);

    return (
        <form className="p-4 md:p-5" onSubmit={e => handleSubmit(e)}>
            <div className="mb-7">
                <FormInputLabel htmlFor="name">Container Name</FormInputLabel>
                <FormInput name="name" type="text" required className="!bg-gray-50 dark:!bg-gray-600" placeholder="Insert a name" value={containerFormData?.name} onChange={e => setContainerFormData("name", e.target.value)} />
                <InputError message={errors?.name} />
            </div>
            <div className="mb-7">
                <FormInputLabel htmlFor="details">Container Details</FormInputLabel>
                <FormTextarea name="details" maxLength={250} placeholder="Add details about your Container" value={containerFormData?.details} onChange={e => setContainerFormData("details", e.target.value || undefined)} />
                <InputError message={errors?.details} />
            </div>
            <div className="mb-7">
                <FormInputLabel htmlFor="location">Container's Room</FormInputLabel>
                <FormComboBox
                    name="location"
                    className="!bg-gray-50 dark:!bg-gray-600"
                    placeholder={isRoomsLoading ? "Please Wait" : rooms && rooms.length > 0 ? "Select a room" : "No rooms available"}
                    options={(rooms && rooms.map(room => ({ name: room.name, value: room.id!.toString() }))) || undefined}
                    onChange={e => setContainerFormData("room_id", parseInt(e.target.value))}
                    value={containerFormData?.room_id && !isRoomsLoading ? containerFormData?.room_id.toString() : ""}
                    disabled={isRoomsLoading || isSubmitLoading || rooms?.length === 0 || (fromRoom && !container ? true : false)}
                    required
                />
                <InputError message={errors?.room_id} />
            </div>
            <div className="mb-7">
                <FormInputLabel htmlFor="image">Container Image</FormInputLabel>
                <FormInput
                    name="image"
                    accept=".png,.jpg"
                    type="file"
                    className="!bg-gray-50 dark:!bg-gray-600 focus:!border-gray-300 dark:focus:!border-gray-500 focus:!ring-0"
                    placeholder="Select a file"
                    onChange={handleImageUpload}
                    value={imageInputValue || ""}
                />
                <InputError message={errors?.image} />
            </div>
            <div className="mb-5">
                <FormInputLabel htmlFor="#">Preview Image</FormInputLabel>
                <div className="relative border border-gray-300 dark:border-gray-500 rounded-lg p-2">
                    {(container?.image && typeof containerFormData?.image === "undefined") || uploadedImagePreview ? (
                        <div className="group">
                            <img src={uploadedImagePreview ? uploadedImagePreview : (container?.image as string)} className="rounded-lg max-h-80 mx-auto group-hover:opacity-50 transition-opacity duration-200"></img>
                            <button
                                type="button"
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-gray-900 text-gray-900 bg-white opacity-40 group-hover:opacity-60 rounded-full text-sm w-9 h-9 inline-flex justify-center items-center"
                                onClick={handleImageRemoval}
                            >
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
                                </svg>
                                <span className="sr-only">Erase image</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-56">
                            <ImageIcon />
                        </div>
                    )}
                </div>
            </div>
            <ConfirmButton type="submit" className="flex items-center justify-center !px-4 text-sm" disabled={isSubmitLoading || isRoomsLoading}>
                {isSubmitLoading || isRoomsLoading ? "Please Wait..." : container ? "Update Container" : "Add Container"}
            </ConfirmButton>
        </form>
    );
};

export default ContainerForm;
