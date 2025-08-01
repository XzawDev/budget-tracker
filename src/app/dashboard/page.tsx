"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import BalanceCard from "@/components/BalanceCard";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUserEmail(user.email);
        setUserName(user.displayName);
        setUserPhoto(user.photoURL);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-10">Memuat...</p>;
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              📒 Budget Tracker
            </h1>

            {userName && (
              <p className="text-sm text-gray-600">Hai, {userName}!</p>
            )}

            {userPhoto && (
              <img
                src={userPhoto}
                alt="Foto Profil"
                className="w-8 h-8 rounded-full mt-1"
              />
            )}

            {userEmail && (
              <p className="text-sm text-gray-600 mt-1">
                Login sebagai: <span className="font-medium">{userEmail}</span>
              </p>
            )}
          </div>

          {/* <button
            onClick={() => signOut(auth)}
            className="bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button> */}
        </div>

        {/* Komponen utama */}
        <BalanceCard />
        <TransactionForm />
        <TransactionList />
      </div>
    </main>
  );
}
