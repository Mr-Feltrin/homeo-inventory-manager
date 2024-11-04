import React, { SVGProps } from "react";

type sortinIconProps = {
    direction?: "asc" | "desc" ;
} & SVGProps<SVGSVGElement>;

const SortingIcon = ({ direction, ...props }: sortinIconProps) => {
    return (
        <svg {...props} className={props.className ?? "w-4 h-4 ms-1 align-middle inline-block text-gray-500 dark:text-gray-300"} width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* up path */}
            <path
                d="M7.9313 10H16.0686C16.6744 10 16.9773 10 17.1175 9.88025C17.2393 9.7763 17.3038 9.62038 17.2913 9.46082C17.2768 9.27693 17.0626 9.06274 16.6342 8.63436L12.5656 4.56573C12.3676 4.36772 12.2686 4.26872 12.1544 4.23163C12.054 4.199 11.9458 4.199 11.8454 4.23163C11.7313 4.26872 11.6323 4.36772 11.4342 4.56573L7.36561 8.63436C6.93724 9.06273 6.72305 9.27693 6.70858 9.46082C6.69602 9.62038 6.76061 9.7763 6.88231 9.88025C7.02257 10 7.32548 10 7.9313 10Z"
                fill="currentColor"
                fillOpacity={direction === "asc" ? 1 : 0.4}
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* down path */}
            <path
                d="M16.0686 14H7.9313C7.32548 14 7.02257 14 6.88231 14.1198C6.76061 14.2238 6.69602 14.3797 6.70858 14.5393C6.72305 14.7232 6.93724 14.9374 7.36561 15.3657L11.4342 19.4344C11.6323 19.6324 11.7313 19.7314 11.8454 19.7685C11.9458 19.8011 12.054 19.8011 12.1544 19.7685C12.2686 19.7314 12.3676 19.6324 12.5656 19.4344L16.6342 15.3657C17.0626 14.9374 17.2768 14.7232 17.2913 14.5393C17.3038 14.3797 17.2392 14.2238 17.1175 14.1198C16.9773 14 16.6744 14 16.0686 14Z"
                fill="currentColor"
                fillOpacity={direction === "desc" ? 1 : 0.4}
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default SortingIcon;
