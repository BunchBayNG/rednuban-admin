import * as React from "react";

const Merchant:  React.FC<React.SVGProps<SVGSVGElement>> = ({ color = "#171717",  }) => (
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
      clipPath="url(#clip0_125_346)"
    >
      <path d="M12.667 4.667H3.333C2.597 4.667 2 5.264 2 6v6c0 .737.597 1.334 1.333 1.334h9.334c.736 0 1.333-.597 1.333-1.334V6c0-.736-.597-1.333-1.333-1.333M5.333 4.667V3.333A1.333 1.333 0 0 1 6.667 2h2.666a1.334 1.334 0 0 1 1.334 1.333v1.334M8 8v.007"></path>
      <path d="M2 8.667a13.33 13.33 0 0 0 12 0"></path>
    </g>
    <defs>
      <clipPath id="clip0_125_346">
        <path fill="#fff" d="M0 0h16v16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default Merchant;
