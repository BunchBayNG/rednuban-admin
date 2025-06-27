import * as React from "react";

const Transactions: React.FC<React.SVGProps<SVGSVGElement>> = ({ color = "#171717",  }) => (
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
      clipPath="url(#clip0_41_19256)"
    >
      <path d="M12.667 10.667v2a.667.667 0 0 1-.667.666H4A1.333 1.333 0 0 1 2.667 12V4m8.666 1.333v-2a.667.667 0 0 0-.666-.666H4a1.333 1.333 0 1 0 0 2.666h8a.667.667 0 0 1 .667.667v2z"></path>
      <path d="M13.333 8v2.667h-2.666a1.333 1.333 0 0 1 0-2.667z"></path>
    </g>
    <defs>
      <clipPath id="clip0_41_19256">
        <path fill="#fff" d="M0 0h16v16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default Transactions;
