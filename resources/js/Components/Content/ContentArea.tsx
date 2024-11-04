import React, { ReactNode } from "react";

interface ContentAreaProps {
    children?: ReactNode;
    className?: string;
    innerClassName?: string;
}

const ContentArea = ({ children, className, innerClassName }: ContentAreaProps) => {
    return (
        <div className={`flex justify-center py-5 ${className ? className : ""}`}>
            <div className={`flex flex-col w-full bg-gray-100 bg-opacity-45 border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 xl:mx-12 ${innerClassName ? innerClassName : ""}`}>{children}</div>
        </div>
    );
};

export default ContentArea;
