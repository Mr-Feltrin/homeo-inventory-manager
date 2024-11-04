import { SVGProps } from "react";

const CategoriesIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path
                xmlns="http://www.w3.org/2000/svg"
                d="M15.5 4H18C19.1046 4 20 4.89543 20 6V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V6C4 4.89543 4.89543 4 6 4H8.5"
                stroke="currentcolor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                xmlns="http://www.w3.org/2000/svg"
                d="M8.62127 3.51493C8.84385 2.62459 9.64382 2 10.5616 2H13.4384C14.3562 2 15.1561 2.62459 15.3787 3.51493L16 6H8L8.62127 3.51493Z"
                stroke="currentcolor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path xmlns="http://www.w3.org/2000/svg" d="M9 12L15 12" stroke="currentcolor" strokeWidth="2" strokeLinecap="round" />
            <path xmlns="http://www.w3.org/2000/svg" d="M9 16H15" stroke="currentcolor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
};

export default CategoriesIcon;
