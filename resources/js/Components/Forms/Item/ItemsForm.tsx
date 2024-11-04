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
import { Category } from "@/types/Category";
import { Item, ItemFormType } from "@/types/Item";
import FormTextarea from "@/Components/Forms/Inputs/FormTextarea";
import AmountInput from "@/Components/Forms/Inputs/AmountInput";

type ItemsFormProps = {
    item?: Item;
    fromContainer?: Container;
    fromRoom?: Room;
    onSubmit: (_success: boolean) => void;
};

const ItemsForm = ({ item, fromContainer, fromRoom, onSubmit }: ItemsFormProps) => {
    const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
    const [isRoomsLoading, setIsRoomsLoading] = useState<boolean>(true);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(true);
    const [isContainersLoading, setIsContainersLoading] = useState<boolean>(true);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const [rooms, setRooms] = useState<Room[] | null>([]);
    const [categories, setCategories] = useState<Category[] | null>([]);
    const [containers, setContainers] = useState<Container[] | null>([]);
    const [imageInputValue, setImageInputValue] = useState<string | null>(null);

    const showToast = useToast();

    const { data, setData, errors, submit } = useApi<ItemFormType>({
        id: item?.id || undefined,
        name: item?.name || "",
        amount: item?.amount ? parseFloat(item.amount.toString()) : undefined,
        image: typeof item?.image === "string" ? undefined : null,
        details: item?.details || undefined,
        category_id: item?.category_id || undefined,
        container_id: item?.container_id || fromContainer?.id,
        room_id: item?.room_id || fromContainer?.room_id || fromRoom?.id
    });

    // Handle the form submission and call the onSubmit callback if it was successful
    const handleSubmit: FormEventHandler = e => {
        e.preventDefault();
        setIsSubmitLoading(true);
        submit(item ? route("items.update") : route("items.store"), item ? "PATCH" : "POST")
            .then(response => {
                if (response.ok) {
                    showToast("success", data ? "Item has been successfully updated" : "Item has been successfully added");
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

    // Fetches the rooms list for the dropdown
    const fetchRoomsList = () => {
        if (fromRoom && !item) {
            setRooms([{ id: fromRoom.id, name: fromRoom.name }]);
            setIsRoomsLoading(false);
        } else if (fromContainer && !item) {
            setRooms([{ id: fromContainer.room_id, name: fromContainer.room_name! }]);
            setContainers([{ id: fromContainer.id, name: fromContainer.name }]);
            setIsRoomsLoading(false);
            setIsContainersLoading(false);
        } else {
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

    // Fetches the containers list for the dropdown
    const fetchContainersList = (room_id: number) => {
        if (fromContainer && !item) {
            setRooms([{ id: fromContainer.room_id, name: fromContainer.room_name! }]);
            setContainers([{ id: fromContainer.id, name: fromContainer.name }]);
            setIsRoomsLoading(false);
            setIsContainersLoading(false);
        } else {
            submit(route("containers.simple_list"), "GET", { room_id })
                .then(response => {
                    if (response.ok) {
                        setContainers(response.data);
                    } else {
                        showToast("danger", "An error occurred while obtaining the containers. Please try again later");
                        setContainers([]);
                    }
                })
                .finally(() => {
                    setIsContainersLoading(false);
                });
        }
    };

    // Fetches the categories list for the dropdown
    const fetchCategoryList = () => {
        submit(route("categories.simple_list"), "GET", {})
            .then(response => {
                if (response.ok) {
                    setCategories(response.data);
                } else {
                    showToast("danger", "An error occurred while obtaining the categories. Please try again later");
                    onSubmit(false);
                }
            })
            .finally(() => {
                setIsCategoriesLoading(false);
            });
    };

    // Handles the image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setUploadedImagePreview(reader.result);
                }
                setData("image", file);
            };
            reader.readAsDataURL(file);
            setImageInputValue(e.target.value);
        }
    };

    // Handles the image removal
    const handleImageRemoval = () => {
        setData("image", null);
        setUploadedImagePreview(null);
        setImageInputValue("");
    };

    // Handles the room change
    const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setData("room_id", parseInt(e.target.value));
        setData("container_id", undefined);
        setIsContainersLoading(true);
        submit(route("containers.simple_list"), "GET", { room_id: parseInt(e.target.value) })
            .then(response => {
                if (response.ok) {
                    setContainers(response.data);
                } else {
                    showToast("danger", "An error occurred while obtaining the containers. Please try again later");
                    setContainers([]);
                }
            })
            .finally(() => {
                setIsContainersLoading(false);
            });
    };

    // Revokes the object URL when the component is unmounted
    useEffect(() => {
        return () => {
            if (uploadedImagePreview) {
                URL.revokeObjectURL(uploadedImagePreview);
            }
        };
    }, [uploadedImagePreview]);

    // Fetch the rooms, categories and containers on component mount
    useEffect(() => {
        fetchCategoryList();
        fetchRoomsList();
        if (item) {
            fetchContainersList(item.room_id);
        } else if (fromRoom) {
            fetchContainersList(fromRoom.id!);
        } else {
            setIsContainersLoading(false);
        }
    }, []);

    return (
        <form className="p-4 md:p-5" onSubmit={e => handleSubmit(e)}>
            <div className="mb-7 flex flex-col lg:flex-row lg:items-center">
                <div className="w-full mb-7 lg:mb-0 lg:w-1/2 lg:mr-2">
                    <FormInputLabel htmlFor="name">Item Name</FormInputLabel>
                    <FormInput name="name" type="text" required className="!bg-gray-50 dark:!bg-gray-600" placeholder="Insert a name" value={data?.name} onChange={e => setData("name", e.target.value)} />
                    <InputError message={errors?.name} />
                </div>
                <div className="w-full lg:w-1/2 lg:ml-2">
                    <FormInputLabel htmlFor="category">Item's Category</FormInputLabel>
                    <FormComboBox
                        name="category"
                        className="!bg-gray-50 dark:!bg-gray-600"
                        placeholder={isCategoriesLoading ? "Please Wait" : categories && categories.length > 0 ? "Select a Category" : "No Categories Available"}
                        options={(categories && categories.map(category => ({ name: category.name, value: category.id!.toString() }))) || undefined}
                        onChange={e => setData("category_id", parseInt(e.target.value))}
                        value={data?.category_id && !isCategoriesLoading ? data?.category_id.toString() : ""}
                        disabled={isCategoriesLoading || categories?.length === 0}
                        required={true}
                    />
                    <InputError message={errors?.category_id} />
                </div>
            </div>
            <div className="mb-7">
                <FormInputLabel htmlFor="name">Details</FormInputLabel>
                <FormTextarea name="details" maxLength={255} placeholder="Describe or give more information about your item." className="max-h-44" value={data?.details} onChange={e => setData("details", e.target.value || undefined)} />
                <InputError message={errors?.details} />
            </div>

            <div className="mb-7 flex flex-col lg:flex-row lg:items-center">
                <div className="w-full mb-7 lg:mb-0 lg:w-1/2 lg:mr-2">
                    <FormInputLabel htmlFor="room">Item's Room</FormInputLabel>
                    <FormComboBox
                        name="room"
                        className="!bg-gray-50 dark:!bg-gray-600"
                        placeholder={isRoomsLoading ? "Please Wait" : rooms && rooms.length > 0 ? "Select a Room" : "No Rooms Available"}
                        options={(rooms && rooms.map(room => ({ name: room.name, value: room.id!.toString() }))) || undefined}
                        onChange={e => handleRoomChange(e)}
                        value={data?.room_id && !isRoomsLoading ? data?.room_id.toString() : ""}
                        disabled={isRoomsLoading || rooms?.length === 0 || ((fromContainer && !item) || (fromRoom && !item) ? true : false)}
                        required={true}
                    />
                    <InputError message={errors?.room_id} />
                </div>
                <div className="w-full lg:w-1/2 lg:ml-2">
                    <FormInputLabel htmlFor="container">Item's Container</FormInputLabel>
                    <FormComboBox
                        name="container"
                        className="!bg-gray-50 dark:!bg-gray-600"
                        placeholder={isContainersLoading ? "Please Wait" : data?.room_id && rooms && rooms.length > 0 ? (containers && containers.length > 0 ? "Select a Container" : "No containers found") : "Please select a room first"}
                        options={(containers && containers.map(container => ({ name: container.name, value: container.id!.toString() }))) || undefined}
                        onChange={e => setData("container_id", parseInt(e.target.value))}
                        value={data?.container_id && !isContainersLoading ? data?.container_id?.toString() : ""}
                        disabled={isContainersLoading || !containers || containers.length === 0 || (fromContainer && !item ? true : false)}
                        required={true}
                    />
                    <InputError message={errors?.container_id} />
                </div>
            </div>

            <div className="mb-7 flex flex-col lg:flex-row lg:items-center">
                <div className="w-full mb-7 lg:mb-0 lg:w-1/2 lg:mr-2">
                    <FormInputLabel htmlFor="image">Item's Image</FormInputLabel>
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
                <div className="w-full lg:w-1/2 lg:ml-2">
                    <FormInputLabel htmlFor="amount">Item's amount</FormInputLabel>
                    <AmountInput
                        className="!bg-gray-50 dark:!bg-gray-600"
                        name="amount"
                        placeholder="Set the amount of your item"
                        required={true}
                        title="Set the amount of the item"
                        value={data?.amount}
                        onChange={e => setData("amount", !isNaN(parseFloat(e.target.value)) ? parseFloat(e.target.value) : undefined)}
                        onPlusClick={() => {
                            setData("amount", data?.amount ? parseFloat((data.amount + 1).toFixed(2)) : 1);
                        }}
                        onMinusClick={() => setData("amount", data?.amount && data.amount > 1 ? parseFloat(((data.amount as number) - 1).toFixed(2)) : 0)}
                    />
                    <InputError message={errors?.amount} />
                </div>
            </div>
            <div className="mb-5">
                <FormInputLabel htmlFor="#">Preview Image</FormInputLabel>
                <div className="relative border border-gray-300 dark:border-gray-500 rounded-lg p-2">
                    {(item?.image && typeof data?.image === "undefined") || uploadedImagePreview ? (
                        <div className="group">
                            <img src={uploadedImagePreview ? uploadedImagePreview : (item?.image as string)} className="rounded-lg max-h-80 mx-auto group-hover:opacity-50 transition-opacity duration-200"></img>
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
            <ConfirmButton type="submit" className="flex items-center justify-center !px-4 text-sm" disabled={isSubmitLoading || isRoomsLoading || isCategoriesLoading || isContainersLoading}>
                {isSubmitLoading || isRoomsLoading || isCategoriesLoading || isContainersLoading ? "Please Wait..." : item ? "Update Item" : "Add Item"}
            </ConfirmButton>
        </form>
    );
};

export default ItemsForm;
