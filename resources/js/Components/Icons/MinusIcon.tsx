import { SVGProps } from "react";

const MinusIcon = ({...props}: SVGProps<SVGSVGElement>) => {
  return (
      <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 12H12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
  );
};

export default MinusIcon;