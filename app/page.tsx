"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';



export default function Home() {
  const router = useRouter();

 
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 5000); 


    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <div className="flex flex-col items-center">
      <DotLottieReact
      src="https://lottie.host/05322472-441b-4f56-b5b3-eb741912450b/H7rp2z4IZj.lottie"
      loop
      autoplay
      className="w-50 h-50"
    />
      </div>
    </div>
  );
}
