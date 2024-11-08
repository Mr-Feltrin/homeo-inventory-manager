import { SVGProps } from "react";

const ContainersIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path
                xmlns="http://www.w3.org/2000/svg"
                d="M3.30394 6.13228C3.71064 4.30213 5.33389 3 7.20869 3H16.7913C18.6661 3 20.2894 4.30213 20.6961 6.13228L20.843 6.79367C21.6051 10.2227 21.6051 13.7773 20.843 17.2063L20.6961 17.8677C20.2894 19.6979 18.6661 21 16.7913 21H7.20869C5.33389 21 3.71064 19.6979 3.30394 17.8677L3.15696 17.2063C2.39495 13.7773 2.39495 10.2227 3.15696 6.79367L3.30394 6.13228Z"
                stroke="currentcolor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path xmlns="http://www.w3.org/2000/svg" d="M2.5 13H8.83784C8.83784 14 9.81081 16 12.2432 16C14.6757 16 15.6486 14 15.6486 13H21.5" stroke="currentcolor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
    );
};

export default ContainersIcon;
