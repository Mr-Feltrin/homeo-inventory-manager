import ContentArea from "@/Components/Content/ContentArea";
import ContentTitle from "@/Components/Content/ContentTitle";
import { Head } from "@inertiajs/react";
import ContainersTable from "@/Components/DataTable/ContainersTable";
import useContainers from "@/hooks/Containers/useContainers";
import ContainerDetails from "@/Components/Container/ContainerDetails";
import ItemDetails from "@/Components/Item/ItemDetails";
import useSteps from "@/hooks/useSteps";
import { Container } from "@/types/Container";
import { Item } from "@/types/Item";
import { useEffect } from "react";

type ContainerStep = { step: "stepAllContainers"; breadcrumb?: string } | { step: "stepViewContainer"; container: Container; breadcrumb?: string } | { step: "stepViewItem"; item: Item; breadcrumb?: string };

type ContainersProps = {
    container?: Container;
};

const Containers = ({ container }: ContainersProps) => {
    // Lift the state up to the parent component
    const containersState = useContainers();
    // Controls the step of the container
    const { step, updateStep, setCurrentStep, generateBreadcrumbs } = useSteps<ContainerStep>({ step: "stepAllContainers", breadcrumb: "Containers List" });
    // Get the title of the step
    const breadcrumbs = generateBreadcrumbs();

    useEffect(() => {
        // Update the step when a container is passed as a prop
        if (container) {
            window.history.replaceState({}, "", route("containers"));
            updateStep({ step: "stepViewContainer", container: container, breadcrumb: container.name });
        }
    }, [container]);

    // Handles the containers information when an item changes
    const handleItemsChange = () => {
        containersState.fetchContainers(containersState.state.currentPage);
    };

    // Sets the step information when the container is updated
    useEffect(() => {
        if (step.step === "stepViewContainer") {
            const updatedContainer = containersState.state.containers?.find(c => c.id === step.container.id);
            if (updatedContainer) {
                setCurrentStep({ ...step, container: updatedContainer });
            }
        }
    }, [containersState.state.containers]);

    return (
        <>
            <Head title="Containers" />

            <ContentArea className="min-h-screen">
                <ContentTitle title={step.breadcrumb ?? ""} breadCrumbs={breadcrumbs} />
                <div className="flex flex-col flex-1 px-2 w-full mb-8 mx-auto max-w-screen-2xl lg:px-5">
                    {step.step === "stepAllContainers" ? (
                        <ContainersTable
                            containerState={containersState}
                            onContainerView={container => updateStep({ step: "stepViewContainer", container, breadcrumb: container.name })}
                            onNestedItemView={item => updateStep({ step: "stepViewItem", item: item, breadcrumb: item.name })}
                        />
                    ) : step.step === "stepViewContainer" ? (
                        <ContainerDetails container={step.container} onItemView={item => updateStep({ step: "stepViewItem", item, breadcrumb: item.name })} onItemsChange={handleItemsChange} />
                    ) : (
                        step.step === "stepViewItem" && <ItemDetails item={step.item} />
                    )}
                </div>
            </ContentArea>
        </>
    );
};

export default Containers;
