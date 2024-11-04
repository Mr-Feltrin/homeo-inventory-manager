import useApi from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { Activity } from "@/types/Activity";
import React from "react";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { router } from "@inertiajs/react";
import HomeoIcon from "@/Components/Icons/HomeoIcon";
import ListNotFoundIcon from "@/Components/Icons/ListNotFoundIcon";

const Activities = () => {
    const [activityData, setActivityData] = useState<Activity[] | null>(null);

    const { submit, isLoading } = useApi<Activity[]>();
    const showToast = useToast();

    useEffect(() => {
        submit(route("activities"), "GET").then(response => {
            if (response.ok) {
                setActivityData(response.data);
            } else {
                showToast("danger", "Failed to obtain your activities, please try again later.");
            }
        });
    }, []);

    const truncateText = (text: string) => {
        if (text.length > 30) {
            return text.substring(0, 30) + "...";
        }
        return text;
    };

    // Redirects the user to the model page when clicking on the model name
    const handleModelClick = (model: string, id: number) => {
        if (model === "Room") {
            router.get(route("rooms", id));
        } else if (model === "Container") {
            router.get(route("containers", id));
        } else if (model === "Item") {
            router.get(route("items", id));
        } else if (model === "Category") {
            router.get(route("categories"));
        }
    };

    // Performs a treatment on the message to be displayed in the activities
    const handleMessage = (activity: Activity) => {
        let action = activity.action.toLowerCase();

        if (activity.changes && activity.action === "updated") {
            const keys = Object.keys(activity.changes);
            if (keys.length === 1 && (keys.includes("room_id") || keys.includes("container_id") || keys.includes("category_id"))) {
                action = "moved";
            }
        }

        return (
            <p className="text-sm font-normal text-gray-600 dark:text-gray-300 break-words cursor-default">
                You {action} <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 mx-1 py-0.5 rounded">{activity.current_model_type}</span>{" "}
                <span
                    className={activity.current_model_active ? "cursor-pointer font-semibold text-blue-600 dark:text-blue-500 hover:underline" : "font-semibold text-gray-700 dark:text-white"}
                    onClick={() => (activity.current_model_active ? handleModelClick(activity.current_model_type, activity.current_model_id) : null)}
                >
                    {activity.current_model_name}
                </span>{" "}
                {action !== "created" && action !== "deleted" && activity.changes && (
                    <>
                        {Object.entries(activity.changes).map(([key, change], index) => {
                            const isColumnFk = key === "room_id" || key === "container_id" || key === "category_id";
                            const columnName = isColumnFk ? key.replace("_id", "") : key;

                            return (
                                <React.Fragment key={key}>
                                    {index > 0 && ", "}
                                    {isColumnFk ? (
                                        <>
                                            {columnName.capitalizeFirstLetter()} from{" "}
                                            <span
                                                className={change.previousModelActive ? "cursor-pointer font-semibold text-blue-600 dark:text-blue-500 hover:underline" : "font-semibold text-gray-700 dark:text-white"}
                                                onClick={() => (change.previousModelActive && change.previousModelType ? handleModelClick(change.previousModelType, change.previousValue as number) : null)}
                                            >
                                                {change.previousModelName ?? "Nothing"}
                                            </span>{" "}
                                            to{" "}
                                            <span
                                                className={change.newModelActive ? "cursor-pointer font-semibold text-blue-600 dark:text-blue-500 hover:underline" : "font-semibold text-gray-700 dark:text-white"}
                                                onClick={() => (change.newModelActive && change.newModelType ? handleModelClick(change.newModelType, change.newValue as number) : null)}
                                            >
                                                {change.newModelName ?? "Nothing"}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            {columnName.capitalizeFirstLetter()} from <span className="font-semibold text-gray-700 dark:text-white">{change.previousValue ? truncateText(String(change.previousValue)) : "Nothing"}</span> to{" "}
                                            <span className="font-semibold text-gray-900 dark:text-white">{String(change.newValue ?? "Nothing")}</span>
                                        </>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </>
                )}
            </p>
        );
    };

    return isLoading ? (
        <div className="flex w-full justify-center items-center">
            <HomeoIcon className="text-white w-24 sm:w-32 lg:w-36 xl:w-48 brightness-[75%] dark:brightness-[50%] animate-pulse pointer-events-none" />
        </div>
    ) : activityData && activityData.length > 0 ? (
        <ol className="dark:border-gray-700 w-full">
            {activityData.map((activity: Activity, index: number) => (
                <li key={index} className="mb-6 mx-6">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
                        <div className="sm:flex items-center justify-between gap-4">
                            <div className="flex-grow min-w-0">{handleMessage(activity)}</div>
                            <div className="flex-shrink-0 mt-2 sm:mt-0">
                                <p className="text-xs font-normal text-gray-400">{formatDistanceToNow(new Date(activity.created_at))} ago</p>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ol>
    ) : (
        <div className="flex flex-col w-full justify-center items-center pb-4">
           <ListNotFoundIcon className="w-20 sm:w-24 lg:w-32 xl:w-40 -mt-3 text-gray-500" />
           <p className="text-base text-center sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-500">You have no Activities</p>
        </div>
    );
};

export default Activities;
