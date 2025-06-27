import * as React from "react";

const Logout:  React.FC<React.SVGProps<SVGSVGElement>> = ({ color = "#171717", }) => (
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
      clipPath="url(#clip0_133_415)"
    >
      <path d="M9.333 5.334V4A1.333 1.333 0 0 0 8 2.667H3.333A1.333 1.333 0 0 0 2 4v8a1.333 1.333 0 0 0 1.333 1.334H8A1.333 1.333 0 0 0 9.333 12v-1.333"></path>
      <path d="m12 10 2-2M4.667 8H14l-2-2z"></path>
    </g>
    <defs>
      <clipPath id="clip0_133_415">
        <path fill="#fff" d="M0 0h16v16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default Logout;
