import ContentArea from "@/Components/Content/ContentArea";
import RoomsIcon from "@/Components/Icons/RoomsIcon";
import CounterCard from "./cards/CounterCard";
import ContainersIcon from "@/Components/Icons/ContainersIcon";
import ItemsIcon from "@/Components/Icons/ItemsIcon";
import CategoriesIcon from "@/Components/Icons/CategoriesIcon";
import { Head } from "@inertiajs/react";
import ContentTitle from "@/Components/Content/ContentTitle";
import Activities from "./partials/Activities";
import useApi from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";

type TotalModels = {
    total_rooms: number;
    total_containers: number;
    total_items: number;
    total_categories: number;
};

const Dashboard = () => {
    const [totalModels, setTotalModels] = useState<TotalModels>();
    const showToast = useToast();
    const { isLoading, submit } = useApi();

    useEffect(() => {
        submit(route("dashboard.total_user_storage"), "GET").then(response => {
            if (response.ok) {
                setTotalModels(response.data);
            } else {
                showToast("danger", "Could not retrieve total counts, please try again later");
            }
        });
    }, []);

    return (
        <>
            <Head title="Dashboard" />

            <ContentArea className="min-h-screen" innerClassName="!bg-transparent !mx-2 px-6 pt-6">
                <div className="flex flex-wrap justify-center gap-3">
                    <CounterCard isLoading={isLoading} count={totalModels?.total_rooms ?? 0} title="Your total Rooms" Icon={RoomsIcon} href={route("rooms")} />
                    <CounterCard isLoading={isLoading} count={totalModels?.total_containers ?? 0} title="Your total Containers" Icon={ContainersIcon} href={route("containers")} />
                    <CounterCard isLoading={isLoading} count={totalModels?.total_items ?? 0} title="Your total Items" Icon={ItemsIcon} href={route("items")} />
                    <CounterCard isLoading={isLoading} count={totalModels?.total_categories ?? 0} title="Your total Categories" Icon={CategoriesIcon} href={route("categories")} />
                </div>
                <ContentArea className="h-full" innerClassName="!m-0">
                    <ContentTitle className="!py-3.5 flex !font-semibold" title="Recent Activities" />
                    <div className="flex justify-center w-full h-full">
                        <Activities />
                    </div>
                </ContentArea>
            </ContentArea>
        </>
    );
};

export default Dashboard;
