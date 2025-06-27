import * as React from "react";

const Api: React.FC<React.SVGProps<SVGSVGElement>> = ({ color = "#171717",  }) => (
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
      clipPath="url(#clip0_125_373)"
    >
      <path d="m5.333 6 2 2-2 2M8.667 10h2"></path>
      <path d="M10.667 2.667H5.333a2.667 2.667 0 0 0-2.666 2.667v5.333a2.667 2.667 0 0 0 2.666 2.667h5.334a2.667 2.667 0 0 0 2.666-2.667V5.334a2.667 2.667 0 0 0-2.666-2.667"></path>
    </g>
    <defs>
      <clipPath id="clip0_125_373">
        <path fill="#fff" d="M0 0h16v16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default Api;
