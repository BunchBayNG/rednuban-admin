
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/svg Icons/Logo";
import MailBox from "@/components/svg Icons/MailBox";
import Lock from "@/components/svg Icons/Lock";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Password is required");
      return;
    }
    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setIsLoading(true);
  
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      console.log("Login response:", data); // Debug log
      if (res.ok && data.success) {
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Logo />
        <h1 className="text-2xl font-semibold text-primary">Sign In</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MailBox className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              className="w-full h-14 bg-[#F8F8F8] border-0 pl-10 pr-4 rounded-lg focus:ring-2 transition-all duration-200 flex items-center"
            />
            <label
              htmlFor="email"
              className={`absolute left-10 text-gray-400 text-sm transition-all duration-200 pointer-events-none inline-block px-1 ${
                email || emailFocused
                  ? "top-[-1.5] text-xs text-gray-500 font-medium bg-card"
                  : "top-5"
              }`}
            >
              Email Address
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full h-14 bg-[#F8F8F8] border-0 pl-10 pr-10 rounded-lg focus:ring-2 transition-all duration-200 flex items-center"
            />
            <label
              htmlFor="password"
              className={`absolute left-10 text-gray-400 text-sm transition-all duration-200 pointer-events-none inline-block px-1 ${
                password || passwordFocused
                  ? "top-[-1.5] text-xs text-gray-500 font-medium bg-card"
                  : "top-5"
              }`}
            >
              Password
            </label>
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="text-right">
            <Link href="/forgot" className="text-sm text-[#C80000] hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
        <Button
          type="submit"
          className={`w-full py-2 rounded-lg transition-colors duration-200 ${
            email && !isLoading ? "bg-[#C80000] hover:bg-[#A60000] text-white" : "bg-[#F8F8F8] hover:bg-gray-400 text-gray-600"
          }`}
          disabled={!email || isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}