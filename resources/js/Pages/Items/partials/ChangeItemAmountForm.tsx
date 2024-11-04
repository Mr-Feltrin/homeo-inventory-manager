import ConfirmButton from "@/Components/Forms/buttons/ConfirmButton";
import AmountInput from "@/Components/Forms/Inputs/AmountInput";
import FormInput from "@/Components/Forms/Inputs/FormInput";
import FormInputLabel from "@/Components/Forms/Inputs/FormInputLabel";
import ImageIcon from "@/Components/Icons/ImageIcon";
import useApi from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { Item, ItemFormType } from "@/types/Item";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type ChangeItemAmountFormProps = {
    item: Item;
    onSubmit: (_success: boolean) => void;
};

type ItemEditAmountType = Omit<ItemFormType, "name" | "amount"> & {
    name?: string;
    amount?: number;
};

const ChangeItemAmountForm = ({ item, onSubmit }: ChangeItemAmountFormProps) => {
    const { data, setData, isLoading, submit } = useApi<ItemEditAmountType>({
        id: item?.id,
        amount: item?.amount ? parseFloat(item.amount.toString()) : undefined
    });

    const [amountDifference, setAmountDifference] = useState<number>(0);

    const showToast = useToast();

    useEffect(() => {
        setData("id", item?.id);
        setData("amount", item?.amount ? parseFloat(item.amount.toString()) : undefined);
    }, [item]);

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newAmount = !isNaN(parseFloat(e.target.value)) ? parseFloat(e.target.value) : 0;
        setData("amount", newAmount);
        const difference = parseFloat((newAmount - (item?.amount || 0)).toFixed(2));
        setAmountDifference(difference);
    };

    const handlePlusClick = () => {
        const newAmount = data && data.amount !== undefined ? parseFloat((data.amount + 1).toFixed(2)) : 0;
        setData("amount", newAmount);
        const difference = parseFloat((newAmount - (item?.amount || 0)).toFixed(2));
        setAmountDifference(difference);
    };

    const handleMinusClick = () => {
        const newAmount = data && data.amount !== undefined ? parseFloat((data.amount - 1).toFixed(2)) : 0;
        setData("amount", newAmount);
        const difference = parseFloat((newAmount - (item?.amount || 0)).toFixed(2));
        setAmountDifference(difference);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await submit(route("items.update_amount"), "PATCH").then(response => {
            if (response.ok) {
                showToast("success", "Item's amount has been updated successfully");
                onSubmit(true);
            } else {
                if (response.status === 500) {
                    showToast("danger", "An error occurred while updating the item's amount. Please try again later");
                    onSubmit(false);
                }
            }
        });
    };

    return (
        <form className="p-4 md:p-5" onSubmit={handleSubmit}>
            <div className="w-full mb-4">
                <FormInputLabel htmlFor="name">Item Name</FormInputLabel>
                <FormInput disabled={true} name="name" type="text" required className="!bg-gray-50 dark:!bg-gray-600" value={item?.name.capitalizeFirstLetter()} />
            </div>
            <div className="mb-7 flex flex-col lg:flex-row lg:items-center">
                <div className="w-full mb-7 lg:mb-0 lg:w-1/2 lg:mr-2">
                    <FormInputLabel htmlFor="amount">Total Amount</FormInputLabel>
                    <FormInput name="amount" type="number" value={data?.amount} onChange={handleAmountChange} className="!bg-gray-50 dark:!bg-gray-600" />
                </div>
                <div className="w-full lg:w-1/2 lg:ml-2">
                    <FormInputLabel htmlFor="newAmount">New Amount</FormInputLabel>
                    <AmountInput
                        name="newAmount"
                        className="!bg-gray-50 dark:!bg-gray-600"
                        value={amountDifference > 0 ? `+${amountDifference}` : `${amountDifference}`}
                        onPlusClick={handlePlusClick}
                        onMinusClick={handleMinusClick}
                        disabled
                    />
                </div>
            </div>
            <div className="mb-5">
                <FormInputLabel htmlFor="#">Item's Image</FormInputLabel>
                <div className="relative border border-gray-300 dark:border-gray-500 rounded-lg p-2">
                    {item?.image ? (
                        <img src={item.image as string} className="rounded-lg max-h-80 mx-auto group-hover:opacity-50 transition-opacity duration-200"></img>
                    ) : (
                        <div className="flex items-center justify-center h-56">
                            <ImageIcon />
                        </div>
                    )}
                </div>
            </div>
            <ConfirmButton type="submit" className="flex items-center justify-center !px-4 text-sm" disabled={isLoading}>
                {isLoading ? "Please Wait..." : "Update Amount"}
            </ConfirmButton>
        </form>
    );
};

export default ChangeItemAmountForm;
