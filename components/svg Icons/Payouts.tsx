import * as React from "react";

const Payouts:React.FC<React.SVGProps<SVGSVGElement>> = ({ color = "#171717",  }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
  >
    <g
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
      clipPath="url(#clip0_125_361)"
    >
      <path d="M2 14h12M2 6.667h12M3.333 4 8 2l4.667 2M2.667 6.667V14M13.333 6.667V14M5.333 9.333v2M8 9.333v2M10.667 9.333v2"></path>
    </g>
    <defs>
      <clipPath id="clip0_125_361">
        <path fill="#fff" d="M0 0h16v16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default Payouts;
