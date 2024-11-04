import ContentArea from "@/Components/Content/ContentArea";
import ContentTitle from "@/Components/Content/ContentTitle";
import { Head } from "@inertiajs/react";
import ItemsTable from "@/Components/DataTable/ItemsTable";
import useItems from "@/hooks/Items/useItems";
import { Item } from "@/types/Item";
import useSteps from "@/hooks/useSteps";
import ItemDetails from "@/Components/Item/ItemDetails";
import { useEffect } from "react";

type ItemStep = { step: "stepAllItems"; breadcrumb?: string } | { step: "stepViewItem"; item: Item; breadcrumb?: string };

type ItemsProps = {
    item?: Item;
};

const Items = ({ item }: ItemsProps) => {
    const itemsState = useItems();

    const { step, updateStep, generateBreadcrumbs } = useSteps<ItemStep>({ step: "stepAllItems", breadcrumb: "Items List" });

    const breadcrumbs = generateBreadcrumbs();

    useEffect(() => {
        if (item) {
            window.history.replaceState({}, "", route("items"));
            updateStep({ step: "stepViewItem", item: item, breadcrumb: item.name });
            console.log(item);
        }
    }, [item]);

    return (
        <>
            <Head title="Items" />
            <ContentArea className="min-h-screen">
                <ContentTitle title={step.breadcrumb ?? ""} breadCrumbs={breadcrumbs} />
                <div className="flex flex-col flex-1 px-2 w-full mb-8 mx-auto max-w-screen-2xl lg:px-5">
                    {step.step === "stepAllItems" ? (
                        <ItemsTable itemState={itemsState} onViewItem={item => updateStep({ step: "stepViewItem", item: item, breadcrumb: item.name.capitalizeFirstLetter() })} />
                    ) : (
                        step.step === "stepViewItem" && <ItemDetails item={step.item} />
                    )}
                </div>
            </ContentArea>
        </>
    );
};

export default Items;
