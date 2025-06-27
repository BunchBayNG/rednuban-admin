import * as React from "react";

const Audit:  React.FC<React.SVGProps<SVGSVGElement>> = ({ color = "#171717",  }) => (
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
      clipPath="url(#clip0_125_388)"
    >
      <path d="M9.333 2v2.667a.667.667 0 0 0 .667.666h2.667"></path>
      <path d="M11.333 14H4.667a1.333 1.333 0 0 1-1.334-1.333V3.333A1.333 1.333 0 0 1 4.667 2h4.666l3.334 3.333v7.334A1.334 1.334 0 0 1 11.333 14"></path>
      <path d="M8 12a2.667 2.667 0 1 0 0-5.333A2.667 2.667 0 0 0 8 12"></path>
      <path d="M8 8.331v1.003l.667.666"></path>
    </g>
    <defs>
      <clipPath id="clip0_125_388">
        <path fill="#fff" d="M0 0h16v16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default Audit;
