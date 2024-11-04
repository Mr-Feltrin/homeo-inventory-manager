import LoadingIcon from "@/Components/Icons/LoadingIcon";
import { router } from "@inertiajs/react";

interface CounterCardProps {
    count: number;
    title: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    href: string;
    isLoading?: boolean;
}

const CounterCard = ({ count, title, Icon, isLoading, href }: CounterCardProps) => {
    return (
        <div className="flex-grow basis-60 max-w-full min-h-32 lg:basis-1/3 xl:basis-1/5 2xl:basis-1/5 content-center border dark:border-gray-600 rounded-lg px-6 py-5 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 cursor-default">
            <div className="flex justify-between gap-6 items-center">
                <div className={`flex flex-col items-center content-center ${!isLoading ? "cursor-pointer" : ""}`} title="View" onClick={() => (!isLoading ? router.get(href) : null)}>
                    {isLoading ? (
                        <div className="py-2">
                            <LoadingIcon />
                        </div>
                    ) : (
                        <h1 className="font-extrabold text-gray-800 dark:text-gray-200 flex-grow flex-shrink text-3xl mb-1">{count}</h1>
                    )}
                    <p className="text-sm text-gray-800 dark:text-gray-300 text-center">{title}</p>
                </div>
                <div className="rounded-full bg-gray-200 dark:bg-gray-600 p-2.5">
                    <Icon className="w-8 h-8" />
                </div>
            </div>
        </div>
    );
};

export default CounterCard;
