// app/dashboard/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

const Dashboard = () => {
  const { user, authenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !authenticated) {
      router.push("/login");
    }
  }, [authenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div>
      <p>Welcome {user?.name}!</p> 
      <p>This is your protected dashboard</p>
      
    </div>
  );
};

export default Dashboard;