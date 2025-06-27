import * as React from "react";

const View: React.FC<React.SVGProps<SVGElement>> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
  >
    <g
      stroke="#21272A"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.4"
      clipPath="url(#clip0_70_19703)"
    >
      <path d="M8 9.333a1.333 1.333 0 1 0 0-2.667 1.333 1.333 0 0 0 0 2.667"></path>
      <path d="M14.667 8Q12 12.668 8.001 12.668T1.334 8.001q2.667-4.667 6.667-4.667t6.666 4.667"></path>
    </g>
    <defs>
      <clipPath id="clip0_70_19703">
        <path fill="#fff" d="M0 0h16v16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default View;
