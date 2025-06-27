import * as React from "react";

const Notification: React.FC<React.SVGProps<SVGElement>> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="25"
    fill="none"
    viewBox="0 0 24 25"
  >
    <g
      stroke="#21272A"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
      clipPath="url(#clip0_49_20155)"
    >
      <path d="M10 5.5a2 2 0 1 1 4 0 7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6M9 17.5v1a3 3 0 0 0 6 0v-1"></path>
    </g>
    <defs>
      <clipPath id="clip0_49_20155">
        <path fill="#fff" d="M0 .5h24v24H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default Notification;
