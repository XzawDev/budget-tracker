"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-20 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold text-blue-700">
            Kelola Keuanganmu dengan Mudah
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Budget Tracker membantu kamu mencatat pemasukan dan pengeluaran
            dengan cepat, mudah, dan aman.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              onClick={() => router.push("/register")}
              className="px-6 py-3 text-base"
            >
              Daftar Sekarang
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/login")}
              className="text-base"
            >
              Masuk
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            {
              title: "Catat Transaksi",
              desc: "Tambah pemasukan dan pengeluaran dengan beberapa klik saja.",
            },
            {
              title: "Pantau Sisa Dana",
              desc: "Lihat saldo tersisa secara real-time di dashboard kamu.",
            },
            {
              title: "Statistik Ringkas",
              desc: "Fitur grafik dan rekap harian yang memudahkan analisa.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100"
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-600">
                {f.title}
              </h3>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 border-t pt-6">
          &copy; {new Date().getFullYear()} Budget Tracker by Alfa. All rights
          reserved.
        </footer>
      </div>
    </main>
  );
}
