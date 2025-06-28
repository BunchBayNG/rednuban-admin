import * as React from "react";

const Default: React.FC<React.SVGProps<SVGElement>> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
  >
    <g
      strokeLinecap="round"
      strokeLinejoin="round"
      clipPath="url(#clip0_264_44889)"
    >
      <path
        stroke="#171717"
        strokeWidth="1.2"
        d="M10 10.003v3.333h3.333M6 3.036a5.354 5.354 0 0 1 4 9.933zM3.754 4.773v.007M2.707 7.336v.007"
      ></path>
      <path
        stroke="#21272A"
        strokeWidth="1.333"
        d="M3.088 10.07v.007M4.773 12.242v.007M7.334 13.29v.006"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_264_44889">
        <path fill="#fff" d="M0 0h16v16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default Default;
