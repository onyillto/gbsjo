"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function RootPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user?.token) {
      router.replace("/dashboard");
    } else {
      router.replace("/auth/login");
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-6 h-6 rounded-full border-2 border-[#0F3E76] border-t-transparent animate-spin" />
    </div>
  );
}
