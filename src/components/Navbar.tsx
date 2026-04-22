"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth";

type NavbarProps = {
  email: string;
};

export default function Navbar({ email }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <div className="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
      <div>
        <h1 className="text-xl font-bold">Task Dashboard</h1>
        <p className="text-sm text-gray-500">{email}</p>
      </div>

      <button
        onClick={handleLogout}
        className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}