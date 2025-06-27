import * as React from "react";

const Vnu: React.FC<React.SVGProps<SVGSVGElement>> = ({ color = "#171717",  }) => (
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
      clipPath="url(#clip0_125_339)"
    >
      <path d="M12 2.667H4c-.736 0-1.333.597-1.333 1.333v8c0 .737.597 1.334 1.333 1.334h8c.736 0 1.333-.597 1.333-1.334V4c0-.736-.597-1.333-1.333-1.333M2.667 6.667h10.666M6.667 2.667v10.667"></path>
    </g>
    <defs>
      <clipPath id="clip0_125_339">
        <path fill="#fff" d="M0 0h16v16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default Vnu;
