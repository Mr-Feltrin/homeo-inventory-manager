import ConfirmButton from "@/Components/Forms/buttons/ConfirmButton";
import FormInput from "@/Components/Forms/Inputs/FormInput";
import FormInputLabel from "@/Components/Forms/Inputs/FormInputLabel";
import InputError from "@/Components/Forms/Inputs/InputError";
import { useToast } from "@/hooks/useToast";
import { Room } from "@/types/Room";
import { FormEvent, useEffect, useState } from "react";
import useApi from "@/hooks/useApi";
import ImageIcon from "@/Components/Icons/ImageIcon";
import CancelIcon from "@/Components/Icons/CancelIcon";
import FormTextarea from "@/Components/Forms/Inputs/FormTextarea";

type RoomFormProps = {
    data?: Room | null;
    onSubmit: (_isSuccessful: boolean) => void;
};

const RoomForm = ({ data, onSubmit }: RoomFormProps) => {
    const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
    const [imageInputValue, setImageInputValue] = useState<string | null>(null);
    const showToast = useToast();

    const {
        data: roomFormData,
        setData: setRoomFormData,
        isLoading,
        errors,
        submit
    } = useApi<Room>({
        id: data?.id || undefined,
        name: data?.name || "",
        description: data?.description || "",
        image: typeof data?.image === "string" ? undefined : null
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submit(data ? route("rooms.update") : route("rooms.store"), data ? "PATCH" : "POST").then(response => {
            if (response.ok) {
                showToast("success", data ? "Room has been successfully updated" : "Room has been successfully added");
                return onSubmit(true);
            } else {
                if (response.status !== 422) {
                    showToast("danger", "An error occurred while processing your request. Please try again later");
                    return onSubmit(false);
                }
            }
        });
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setUploadedImagePreview(reader.result);
                }
                setRoomFormData("image", file);
            };
            reader.readAsDataURL(file);
            setImageInputValue(e.target.value);
        }
    };


    const handleImageRemoval = () => {
        setRoomFormData("image", null);
        setUploadedImagePreview(null);
        setImageInputValue("");
    };

    useEffect(() => {
        return () => {
            if (uploadedImagePreview) {
                URL.revokeObjectURL(uploadedImagePreview);
            }
        };
    }, [uploadedImagePreview]);

    return (
        <form className="p-4 md:p-5" onSubmit={e => handleSubmit(e)}>
            <div className="mb-7">
                <FormInputLabel htmlFor="name">Room Name</FormInputLabel>
                <FormInput name="name" type="text" className="!bg-gray-50 dark:!bg-gray-600" placeholder="Insert a name" value={roomFormData?.name} onChange={e => setRoomFormData("name", e.target.value)} />
                <InputError message={errors?.name} />
            </div>
            <div className="mb-7">
                <FormInputLabel htmlFor="image">Room Image</FormInputLabel>
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
            <div className="mb-7">
                <FormInputLabel htmlFor="description">Room Description</FormInputLabel>
                <FormTextarea name="description" maxLength={250} placeholder="Add details about your Room" value={roomFormData?.description} onChange={e => setRoomFormData("description", e.target.value || undefined)} />
                <InputError message={errors?.description} />
            </div>
            <div className="mb-5">
                <FormInputLabel htmlFor="#">Preview Image</FormInputLabel>
                <div className="relative border border-gray-300 dark:border-gray-500 rounded-lg p-2 shadow">
                    {(data?.image && typeof roomFormData?.image === "undefined") || uploadedImagePreview ? (
                        <div className="group">
                            <img src={uploadedImagePreview ? uploadedImagePreview : (data?.image as string)} className="rounded-lg max-h-80 mx-auto group-hover:opacity-50 transition-opacity duration-200"></img>
                            <button
                                type="button"
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-gray-900 text-gray-900 bg-white opacity-40 group-hover:opacity-60 rounded-full text-sm w-9 h-9 inline-flex justify-center items-center"
                                onClick={handleImageRemoval}
                            >
                                <CancelIcon />
                                <span className="sr-only">Erase image</span>
                            </button>
                        </div>
                    ) : (
                        <div className={"flex items-center justify-center h-56"}>
                            <ImageIcon />
                        </div>
                    )}
                </div>
            </div>
            <ConfirmButton type="submit" className="flex items-center justify-center !px-4 text-sm">
                {!isLoading ? !data ? <>Create Room</> : <>Update Room</> : <>Saving...</>}
            </ConfirmButton>
        </form>
    );
};

export default RoomForm;
