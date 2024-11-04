import { SVGProps } from "react";

const ChangeAmountIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
                {/* <rect x="6" y="6" width="36" rx="9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" height="36" strokeWidth="2" /> */}
                <path d="M27 31H35" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d="M17 13V21" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d="M21 17H13" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d="M34 14L14 34" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
        </svg>
    );
};

export default ChangeAmountIcon;
