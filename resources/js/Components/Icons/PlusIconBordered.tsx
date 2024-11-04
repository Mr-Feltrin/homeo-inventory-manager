import { SVGProps } from "react";

const AddPlusIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} className={`pe-2 h-7 w-7${ props.className ?? ""}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 12L12 12M12 12L17 12M12 12V7M12 12L12 17" stroke="currentcolor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="9" stroke="currentcolor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default AddPlusIcon;
