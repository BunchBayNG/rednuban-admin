"use client";

import Frame from "@/public/Frame1.png"
import Image from "next/image";
import { useTypewriter, Cursor } from 'react-simple-typewriter';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [text] = useTypewriter({
    words: ['Anytime', 'Anywhere', 'Seamlessly', 'Securely'],
    loop: 0, 
    typeSpeed: 120,
    deleteSpeed: 80,
  });

  return (
    <div className="flex h-screen">
      <div className="w-1/2 relative">
  <Image 
    src={Frame} 
    alt="" 
    className="object-fill h-full w-full"
  />
  
  <div className="absolute top-8 left-6 m-4  text-white">
    <h3 className="text-2xl font-medium">Payment</h3>
      <h1 className="text-5xl font-semibold">
        <span>{text}</span>
        <Cursor cursorStyle='|' />
      </h1>
  </div>
</div>
      {/* Right Side: Auth Form Area */}
      <div className="w-1/2 flex items-center justify-center ">
        {children}
      </div>
    </div>
  );
}