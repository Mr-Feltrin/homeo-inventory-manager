import { Fragment } from "react";

type ContentTitleProps = {
    title: string;
    breadCrumbs?: { title: string; onClick: () => void }[];
    className?: string;
};

const ContentTitle = ({ title, breadCrumbs, className }: ContentTitleProps) => {
    return (
        <div className={`mb-7 dark:border-gray-700 border-gray-200 pt-4 pb-4 border-b px-4 md:px-8 ${breadCrumbs?.length ? "text-lg font-medium" : "text-xl font-semibold"} ${className ?? ""}`}>
            <div className="flex items-center ">
                {(breadCrumbs?.length ?? 0) > 0 &&
                    breadCrumbs?.map((crumb, index) => (
                        <Fragment key={index}>
                            <span onClick={crumb.onClick} className="text-gray-500 dark:text-gray-400 cursor-pointer mr-2.5 underline underline-offset-4">
                                {crumb.title}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 mr-2.5 cursor-default">/</span>
                        </Fragment>
                    ))}
                <h1 className="text-gray-950 dark:text-gray-100 cursor-default">{title}</h1>
            </div>
        </div>
    );
};

export default ContentTitle;
