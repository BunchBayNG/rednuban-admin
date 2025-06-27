import * as React from "react";

const Settlements: React.FC<React.SVGProps<SVGSVGElement>> = ({ color = "#171717",  }) => (
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
      clipPath="url(#clip0_125_354)"
    >
      <path d="M12.667 6H6c-.736 0-1.333.597-1.333 1.333v4c0 .737.597 1.334 1.333 1.334h6.667c.736 0 1.333-.597 1.333-1.334v-4C14 6.597 13.403 6 12.667 6"></path>
      <path d="M9.333 10.667a1.333 1.333 0 1 0 0-2.667 1.333 1.333 0 0 0 0 2.667M11.333 6V4.666A1.333 1.333 0 0 0 10 3.333H3.333A1.333 1.333 0 0 0 2 4.666v4A1.333 1.333 0 0 0 3.333 10h1.334"></path>
    </g>
    <defs>
      <clipPath id="clip0_125_354">
        <path fill="#fff" d="M0 0h16v16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default Settlements;
