import * as React from "react";

const Users: React.FC<React.SVGProps<SVGSVGElement>> = ({ color = "#171717",  }) => (
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
      clipPath="url(#clip0_125_380)"
    >
      <path d="M6 7.333A2.667 2.667 0 1 0 6 2a2.667 2.667 0 0 0 0 5.333M2 14v-1.333A2.667 2.667 0 0 1 4.667 10h2.666A2.667 2.667 0 0 1 10 12.667V14M10.667 2.087a2.666 2.666 0 0 1 0 5.167M14 14v-1.334a2.67 2.67 0 0 0-2-2.566"></path>
    </g>
    <defs>
      <clipPath id="clip0_125_380">
        <path fill="#fff" d="M0 0h16v16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default Users;
