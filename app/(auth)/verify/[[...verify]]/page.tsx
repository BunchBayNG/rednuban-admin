"use client";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import Logo from "@/components/svg Icons/Logo";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VerifyPage() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const from = searchParams.get("from");

  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
  }, [email, router]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value.length !== 6) {
      setError("Please enter all 6 digits of the OTP");
      toast.error("Please enter all 6 digits of the OTP");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      console.log("Sending OTP:", value, "From:", from);
      const url = `/api/auth/verify?otp=${encodeURIComponent(value)}&from=${encodeURIComponent(from || "")}`;
      console.log("Fetching URL:", url);
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      console.log("API response:", data);
      if (res.ok && data.success) {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("organizationId", data.data.organizationId);
        localStorage.setItem("merchantAdminId", data.data.userId);
        toast.success("Verification successful!");
        router.push(data.redirect || "/dashboard");
      } else {
        setError(data.error || "Invalid OTP. Please try again.");
        toast.error(data.error || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setCanResend(false);
    setTimer(60);
    setIsLoading(true);

    try {
      console.log("Resending OTP for email:", email);
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log("Resend OTP response:", data);
      if (res.ok && data.success) {
        toast.success("New OTP sent to " + email);
      } else {
        setError(data.error || "Failed to resend OTP");
        toast.error(data.error || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
      toast.error("Failed to resend OTP. Please try again.");
      console.error("Resend OTP error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Logo />
        <h1 className="text-2xl font-semibold text-primary">Verify it&apos;s you</h1>
        <p className="text-xs font-light">Enter 6-digit OTP code sent to {email}. It&apos;s valid for 5 minutes.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4 flex flex-col items-center justify-center">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(value) => {
              console.log("OTP input:", value);
              setValue(value);
            }}
            disabled={isLoading}
          >
            <InputOTPGroup className="gap-3">
              <InputOTPSlot index={0} className="w-[50px] h-[50px] border-0 rounded-lg bg-[#F8F8F8]" />
              <InputOTPSlot index={1} className="w-[50px] h-[50px] border-0 rounded-lg bg-[#F8F8F8]" />
              <InputOTPSlot index={2} className="w-[50px] h-[50px] border-0 rounded-lg bg-[#F8F8F8]" />
              <InputOTPSlot index={3} className="w-[50px] h-[50px] border-0 rounded-lg bg-[#F8F8F8]" />
              <InputOTPSlot index={4} className="w-[50px] h-[50px] border-0 rounded-lg bg-[#F8F8F8]" />
              <InputOTPSlot index={5} className="w-[50px] h-[50px] border-0 rounded-lg bg-[#F8F8F8]" />
            </InputOTPGroup>
          </InputOTP>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <div className="flex items-center justify-center text-sm">
          <span>Didn&apos;t receive a code?</span>
          {canResend ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={isLoading}
              className="text-red-600 hover:underline pl-1"
            >
              Resend code
            </Button>
          ) : (
            <span className="ml-1 text-gray-500">Resend in {timer}s</span>
          )}
        </div>
        <Button
          type="submit"
          className={`w-full py-2 rounded-lg transition-colors duration-200 ${
            value.length > 0 && !isLoading
              ? "bg-[#C80000] hover:bg-[#A60000] text-white"
              : "bg-[#F8F8F8] hover:bg-gray-400 text-gray-600"
          }`}
          disabled={value.length !== 6 || isLoading}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </form>
    </div>
  );
}