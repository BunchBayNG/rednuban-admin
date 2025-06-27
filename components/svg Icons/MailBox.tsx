import * as React from "react";

const MailBox: React.FC<React.SVGProps<SVGElement>> = () => (
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
      clipPath="url(#clip0_18_12630)"
    >
      <path d="M6.667 14.597v-4.333a2.333 2.333 0 0 0-4.667 0v4.333h12v-4a2.667 2.667 0 0 0-2.667-2.667h-7"></path>
      <path d="M8 7.93V2.597h2.667L12 3.93l-1.333 1.333H8M4 10.597h.667"></path>
    </g>
    <defs>
      <clipPath id="clip0_18_12630">
        <path fill="#fff" d="M0 .597h16v16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default MailBox;
