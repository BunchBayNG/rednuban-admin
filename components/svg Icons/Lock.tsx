import * as React from "react";

const Lock: React.FC<React.SVGProps<SVGElement>> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="17"
    fill="none"
    viewBox="0 0 16 17"
  >
    <g
      stroke="#A5A5A5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
      clipPath="url(#clip0_18_12642)"
    >
      <path d="M11.333 7.93H4.667c-.737 0-1.334.597-1.334 1.334v4c0 .736.597 1.333 1.334 1.333h6.666c.737 0 1.334-.597 1.334-1.333v-4c0-.737-.597-1.334-1.334-1.334"></path>
      <path d="M8 11.93a.667.667 0 1 0 0-1.333.667.667 0 0 0 0 1.333M5.333 7.93V5.263a2.667 2.667 0 0 1 5.334 0V7.93"></path>
    </g>
    <defs>
      <clipPath id="clip0_18_12642">
        <path fill="#fff" d="M0 .597h16v16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default Lock;
