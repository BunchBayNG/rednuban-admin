
import * as React from "react";

const Dashboard: React.FC<React.SVGProps<SVGSVGElement>> = ({ color = "#171717", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <g
      stroke={color} // Use the color prop for stroke
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
      clipPath="url(#clip0_41_19155)"
    >
      <path d="M2.667 2.667h4V8h-4zM2.667 10.667h4v2.666h-4zM9.333 8h4v5.333h-4zM9.333 2.667h4v2.666h-4z"></path>
    </g>
    <defs>
      <clipPath id="clip0_41_19155">
        <path fill="#fff" d="M0 0h16v16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default Dashboard;