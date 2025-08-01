"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Topbar */}
      <header className="w-full h-14 bg-white shadow-md flex items-center px-4 justify-between fixed top-0 z-50">
        <h1 className="text-lg font-semibold">Budget Tracker</h1>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main content */}
      <main className="pt-14 min-h-screen bg-gray-50 p-4">{children}</main>
    </>
  );
}
